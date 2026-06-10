import { type SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import { service } from "./service";
import { project } from "./project";
import { teamMember } from "./teamMember";
import { testimonial } from "./testimonial";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, service, project, teamMember, testimonial, siteSettings],
};
