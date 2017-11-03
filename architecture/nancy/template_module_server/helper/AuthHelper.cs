using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using {{ AppName }}.Models;
using {{ AppName }}.Controllers;
using Jose;

namespace {{ AppName }}.Helpers
{
    public class AuthHelper
    {
        static readonly List<Tuple<string, string>> ActiveApiKeys = new List<Tuple<string, string>>();
        private static readonly List<Tuple<string, string>> Users = new List<Tuple<string, string>>();
        private static readonly byte[] secretKey = new byte[] {
            164, 60, 194, 0, 161, 189,
            41, 38, 130, 89, 141, 234,
            164, 45, 170, 159, 209,
            69, 137, 216, 191, 243,
            131, 47, 250, 32, 107,
            231, 117, 37, 158, 225
        };

        public AuthHelper()
        {

        }

        public static User GetUserFromToken(string token)
        {
            var activeKey = ActiveApiKeys.FirstOrDefault(x => x.Item2 == token);
            
            if (activeKey == null)
                return null;

            var user = VerifyUserName(activeKey.Item1);

            if (user == null)
                return null;

            return user;
        }

        public static ClaimsPrincipal GetClaimsPrincipalFromToken(string token)
        {
            var user = GetUserFromToken(token);

            if (user == null)
                return null;

            return new ClaimsPrincipal(new GenericIdentity(user.UserName, "stateless"));
        }

        public static User VerifyUserName(string username)
        {
            using (var db = new PetaPoco.Database("SWATDB"))
            {
                var sql = string.Format("select TOP 1 * from [user] where username = '{0}'", username);

                var user = db.FirstOrDefault<User>(sql);

                if(user == null)
                    return null;

                return user;
            }
        }

        public static User ValidateUser(string username, string password)
        {
            using (var db = new PetaPoco.Database("SWATDB"))
            {
                var sql = string.Format(@"select * from [user] 
                                          where username = '{0}' 
                                          and password = '{1}'", username, password);

                var user = db.FirstOrDefault<User>(sql);

                if (user == null)
                    return null;

                user.last_login = DateTime.Now;

                var token = JWT.Encode(user, secretKey, JwsAlgorithm.HS256);
                ActiveApiKeys.Add(new Tuple<string, string>(username, token));

                user.Token = token;

                return user;
            }
        }

        public static void RemoveToken(string token)
        {
            if (ActiveApiKeys.Count() == 0)
                return;

            var apiKeyToRemove = ActiveApiKeys.First(x => x.Item2 == token);
            ActiveApiKeys.Remove(apiKeyToRemove);
        }
    }
}
