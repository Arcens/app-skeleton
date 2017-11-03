using {{ config.appName }}.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace {{ config.appName }}.Modules
{
    public class {{ className }}Module : BaseModule
    {
        public {{ className }}Module() 
        {
            var {{ moduleName }} = new {{ className }}Controller(this);

            Get["{{ moduleName }}/"] =  {{ moduleName }}.All;

            Get["{{ moduleName }}/{id}/"] = {{ moduleName }}.FindById;

            Get["{{ moduleName }}/count/"] = {{ moduleName }}.Count;

            Post["{{ moduleName }}/"] = {{ moduleName }}.Create;

            Put["{{ moduleName }}/{id}/"] = {{ moduleName }}.Update;

            Delete["{{ moduleName }}/{id}/"] = {{ moduleName }}.Delete;
        }
    }
}
