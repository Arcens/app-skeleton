using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace {{ AppName }}.Models
{
    public class BaseModel
    {
        public System.Guid _id { get; set; }

        public DateTime? creation_date { get; set; }

        public DateTime? last_update { get; set; }
    }
}