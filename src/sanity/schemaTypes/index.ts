import { type SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import {
  localeString,
  localeText,
  localeBlockContent,
} from "./locale";
import { service } from "./service";
import { project } from "./project";
import { teamMember } from "./teamMember";
import { testimonial } from "./testimonial";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContent,
    localeString,
    localeText,
    localeBlockContent,
    service,
    project,
    teamMember,
    testimonial,
    siteSettings,
  ],
};
