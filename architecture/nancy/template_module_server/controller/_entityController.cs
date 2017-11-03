using Nancy;
using Nancy.ModelBinding;
using Nancy.Security;
using {{ config.appName }}.Helpers;
using {{ config.appName }}.Interfaces;
using {{ config.appName }}.Models;
using {{ config.appName }}.Modules;

namespace {{ config.appName }}.Controllers
{
    public class {{ className }}Controller : ISWAT
    {
        private {{ className }}Module module;


        public {{ className }}Controller({{ className }}Module pContext)
        {
            module = pContext;
        }

        public Response All(dynamic parameters)
        {
            return Helper.QueryHelper<{{ className }}>("select * from {{ moduleName }}", "GET");
        }

        public Response Count(dynamic parameters)
        {
            using (var db = new PetaPoco.Database("SWATDB"))
            {
                var count = db.ExecuteScalar<long>("select count(distinct _id) from {{ moduleName }}");
                return Helper.ResponseHelper(ResponseContent: count);
            }
        }

        public Response Create(dynamic parameters)
        {
            var newElement = module.Bind<{{ className }}>();

            if(newElement != null)
            {
                return Helper.QueryHelper<{{ className }}>(payload: newElement, httpVerb: "POST");
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
                var q = string.Format("delete from {{ moduleName }} where _id = '{0}'", parameters.Id);
                return Helper.QueryHelper<{{ className }}>(q, "DELETE");
            }
            else
            {
                return new Response { StatusCode = HttpStatusCode.NoContent };
            }
        }

        public Response FindById(dynamic parameters)
        {
            if(parameters.Id.HasValue)
            {
                var q = string.Format("select distinct * from {{ moduleName }} where _id = '{0}'", parameters.Id);
                return Helper.QueryHelper<{{ className }}>(q, "GET", getOneElement:true);
            }
            else
            {
                return new Response { StatusCode = HttpStatusCode.NoContent };
            }
        }

        public Response Update(dynamic parameters)
        {
            var newElement = module.Bind<{{ className }}>();

            if(newElement != null)
            {
                return Helper.QueryHelper<{{ className }}>(payload: newElement, httpVerb: "PUT");
            }
            else
            {
                return new Response { StatusCode = HttpStatusCode.NoContent };
            }
        }
    }
}
