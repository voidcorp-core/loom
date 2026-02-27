import YAML from "yaml";

export function parseYaml<T>(raw: string): T {
  return YAML.parse(raw) as T;
}

export function serializeYaml<T>(data: T): string {
  return YAML.stringify(data, { lineWidth: 120 });
}
