import RoleEntry from "@/components/RoleEntry";
import Section from "@/components/ui/Section";
import type { Role } from "@/data/site";

/** Used for both "Experience" and "Internships": same shape, different list. */
export default function Experience({
  id,
  title,
  roles,
}: {
  id: string;
  title: string;
  roles: Role[];
}) {
  return (
    <Section id={id} title={title} bodyClassName="divide-y divide-rule">
      {roles.map((r) => (
        <RoleEntry key={r.id} role={r} />
      ))}
    </Section>
  );
}
