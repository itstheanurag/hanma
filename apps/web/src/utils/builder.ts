import type { TemplateRegistry } from "@/types/builder";

export const getFeaturesByType = (
  registry: TemplateRegistry,
  type?: string,
) => {
  return registry.features.filter((f) => {
    if (type === "other") return !f.featureType;
    return f.featureType === type;
  });
};

export const generateCommand = ({
  projectName,
  selectedBase,
  selectedDatabase,
  selectedAuth,
  selectedPreset,
  selectedMailer,
  selectedUpload,
  selectedTooling,
  selectedOtherFeatures,
}: any) => {
  let cmd = `npx hanma init ${projectName}`;

  if (selectedBase) cmd += ` --server ${selectedBase}`;
  if (selectedDatabase) cmd += ` --db ${selectedDatabase}`;
  if (selectedAuth) cmd += ` --auth ${selectedAuth}`;
  if (selectedPreset) cmd += ` --security ${selectedPreset}`;
  if (selectedMailer) cmd += ` --mailer ${selectedMailer}`;
  if (selectedUpload) cmd += ` --upload ${selectedUpload}`;
  if (selectedTooling) cmd += ` --tooling ${selectedTooling}`;
  if (selectedOtherFeatures.length)
    cmd += ` --features ${selectedOtherFeatures.join(",")}`;

  return cmd;
};
