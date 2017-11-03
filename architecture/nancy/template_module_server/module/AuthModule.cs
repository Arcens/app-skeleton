using {{ AppName }}.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace {{ AppName }}.Modules
{
    public class AuthModule : BaseModule
    {
        public AuthModule()
        {
            var auth = new UserController(this);

            Post["auth/login"] = auth.Login;

            Post["auth/logout"] = auth.Logout;
        }
    }
}
