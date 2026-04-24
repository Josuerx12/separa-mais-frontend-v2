const ROOT_COMPANY_DOMAIN = ["separamais.online", "localhost"];
const COMPANY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const normalizeSlug = (slug: string | null | undefined): string => {
  if (!slug) {
    return "";
  }

  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug || normalizedSlug === "www") {
    return "";
  }

  return COMPANY_SLUG_PATTERN.test(normalizedSlug) ? normalizedSlug : "";
};

export const getCompanySlugFromLocation = ({
  hostname,
}: Pick<Location, "hostname">): string => {
  const normalizedHostname = hostname.toLowerCase().trim();

  const slug = normalizedHostname.split(".")[0];

  if (slug === ROOT_COMPANY_DOMAIN[0] || slug === ROOT_COMPANY_DOMAIN[1]) {
    return "";
  }

  const slugFromHostname = normalizedHostname.endsWith(ROOT_COMPANY_DOMAIN[0])
    ? normalizedHostname.slice(0, -ROOT_COMPANY_DOMAIN[0].length - 1)
    : normalizedHostname.endsWith(ROOT_COMPANY_DOMAIN[1])
      ? normalizedHostname.slice(0, -ROOT_COMPANY_DOMAIN[1].length - 1)
      : slug;

  return normalizeSlug(slugFromHostname);
};

export const getRootHostname = (hostname: string): string => {
  const normalizedHostname = hostname.toLowerCase().trim();

  if (
    normalizedHostname === ROOT_COMPANY_DOMAIN[0] ||
    normalizedHostname.endsWith(`.${ROOT_COMPANY_DOMAIN[0]}`)
  ) {
    return ROOT_COMPANY_DOMAIN[0];
  }

  if (
    normalizedHostname === ROOT_COMPANY_DOMAIN[1] ||
    normalizedHostname.endsWith(`.${ROOT_COMPANY_DOMAIN[1]}`)
  ) {
    return ROOT_COMPANY_DOMAIN[1];
  }

  return normalizedHostname;
};
