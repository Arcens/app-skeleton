using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace {{ config.appName }}.Models
{
    [PetaPoco.TableName("{{ modelName }}")]
    [PetaPoco.PrimaryKey("_id")]
    public class {{className}} : BaseModel
    {
        {% for property in properties %}
        public {{property.type}} {{property.name}} { get; set; }
        {% endfor %}
    }
}