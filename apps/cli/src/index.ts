#!/usr/bin/env node
import { Command } from "commander";
import { init, add, create, module, help, show } from "./commands";
const program = new Command();

program
  .name("hanma")
  .description("Grapple your backend into shape with ready-to-use snippets.")
  .version("0.0.1");

program.addCommand(init);
program.addCommand(add);
program.addCommand(create);
program.addCommand(module);
program.addCommand(show);
program.addCommand(help);
program.parse();
