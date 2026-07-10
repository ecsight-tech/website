import { type SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import {
  localeString,
  localeText,
  localeBlockContent,
} from "./locale";
import { service } from "./service";
import { mediaEvent } from "./mediaEvent";
import { academy } from "./academy";
import { partner } from "./partner";
import { showcase } from "./showcase";
import { project } from "./project";
import { teamMember } from "./teamMember";
import { testimonial } from "./testimonial";
import { siteSettings } from "./siteSettings";
import { contactSubmission } from "./contactSubmission";
import { privacyPolicy } from "./privacyPolicy";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContent,
    localeString,
    localeText,
    localeBlockContent,
    service,
    mediaEvent,
    academy,
    project,
    partner,
    showcase,
    teamMember,
    testimonial,
    siteSettings,
    contactSubmission,
    privacyPolicy,
  ],
};
