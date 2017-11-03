using Nancy;
using Nancy.ModelBinding;
using Newtonsoft.Json;
using {{ AppName }}.Helpers;
using {{ AppName }}.Models;
using {{ AppName }}.Modules;

namespace {{ AppName }}.Controllers
{
    public class UserController
    {
        private AuthModule module;

        public UserController(AuthModule pContext)
        {
            module = pContext;
        }

        public Response All(dynamic parameters)
        {
            return Helper.QueryHelper<User>("select * from user", "GET");
        }

        public Response Count(dynamic parameters)
        {
            using (var db = new PetaPoco.Database("SWATDB"))
            {
                var count = db.ExecuteScalar<long>("select count(distinct _id) from [user]");
                return Helper.ResponseHelper(ResponseContent: count);
            }
        }

        public Response Create(dynamic parameters)
        {
            //return null; 
            var newElement = module.Bind<User>();

            if (newElement != null)
            {
                return Helper.QueryHelper<User>(payload: newElement, httpVerb: "POST");
            }
            else
            {
                return new Response { StatusCode = HttpStatusCode.NoContent };
            }
        }

        public Response Delete(dynamic parameters)
        {
            if (parameters.Id.HasValue)
            {
                var q = string.Format("delete from [user] where _id = '{0}'", parameters.Id);
                return Helper.QueryHelper<User>(q, "DELETE");
            }
            else
            {
                return new Response { StatusCode = HttpStatusCode.NoContent };
            }
        }

        public Response FindById(dynamic parameters)
        {
            if (parameters.Id.HasValue)
            {
                var q = string.Format("select distinct * from [user] where _id = '{0}'", parameters.Id);
                return Helper.QueryHelper<User>(q, "GET");
            }
            else
            {
                return new Response { StatusCode = HttpStatusCode.NoContent };
            }
        }

        public Response Update(dynamic parameters)
        {
            //return null;
            var newElement = module.Bind<User>();

            if (newElement != null)
            {
                return Helper.QueryHelper<User>(payload: newElement, httpVerb: "PUT");
            }
            else
            {
                return new Response { StatusCode = HttpStatusCode.NoContent };
            }
        }

        public Response Login(dynamic parameters)
        {
            var userCredentials = module.Bind<LoginData>();

            var user = AuthHelper.ValidateUser(userCredentials.Username, userCredentials.Password);

            if (user != null)
                return JsonConvert.SerializeObject(user); 

            return HttpStatusCode.Unauthorized;
        }

        public Response Logout(dynamic parameters)
        {
            try
            {
                // limit access to a a method :  module.RequiresAuthentication();
                // get the current user :        var u = module.Context.CurrentUser;

                var token = module.Context.Request.Headers.Authorization;

                if (string.IsNullOrEmpty(token))
                    return HttpStatusCode.BadRequest;

                AuthHelper.RemoveToken(token);

                return Helper.ResponseHelper(HttpStatusCode.OK, null, "User Logout");
            }
            catch (System.Exception ex)
            {
                return Helper.ResponseHelper(HttpStatusCode.InternalServerError, null, ex.Message);
            }
        }
    }
}