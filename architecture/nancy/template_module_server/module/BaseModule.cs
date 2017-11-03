using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace {{ AppName }}.Modules
{
    public class BaseModule : NancyModule
    {
        public BaseModule() :  base("api/")
        {

        }
    }
}