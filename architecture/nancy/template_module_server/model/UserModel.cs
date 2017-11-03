using Nancy.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace {{ AppName }}.Models
{
    public class User : BaseModel, IUserIdentity
    {
        public string firstname { get; set; }

        public string lastname { get; set; }

        [PetaPoco.Ignore]
        public string fullname
        {
            get
            {
                return string.Format("{0} {1}", firstname, lastname);
            }
        }

        public string email { get; set; }

        public string UserName { get; set; }

        public string password { get; set; }

        [PetaPoco.Ignore]
        public string Token { get; set; }

        [PetaPoco.Ignore]
        public IEnumerable<string> Claims { get; set; }

        public DateTime? last_login { get; set; }

        public bool is_lockedout { get; set; }
    }

    public class LoginData
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}