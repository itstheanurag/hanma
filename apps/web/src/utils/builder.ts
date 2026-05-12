import type { TemplateRegistry } from "@repo/schemas";

export const getFeaturesByType = (
  registry: TemplateRegistry,
  type?: string,
) => {
  return (registry.features || []).filter((f) => {
    if (type === "other") return !f.featureType;
    return f.featureType === type;
  });
};

export const generateCommand = ({
  projectName,
  selectedFramework,
  selectedBase,
  selectedDatabase,
  selectedAuth,
  selectedPreset,
  selectedMailer,
  selectedUpload,
  selectedTooling,
  selectedOtherFeatures,
}: any) => {
  let cmd = `npx hanma create ${projectName}`;

  if (selectedFramework) cmd += ` --framework ${selectedFramework}`;
  if (selectedBase) cmd += ` --template ${selectedBase}`;
  if (selectedDatabase) cmd += ` --db ${selectedDatabase}`;
  if (selectedAuth) cmd += ` --auth ${selectedAuth}`;
  if (selectedPreset) cmd += ` --preset ${selectedPreset}`;
  if (selectedMailer) cmd += ` --mailer ${selectedMailer}`;
  if (selectedUpload) cmd += ` --upload ${selectedUpload}`;
  if (selectedTooling) cmd += ` --tooling ${selectedTooling}`;
  if (selectedOtherFeatures.length)
    cmd += ` --features ${selectedOtherFeatures.join(",")}`;

  return cmd;
};
