#!/usr/bin/env node
import { Command } from "commander";
import {
  init,
  add,
  create,
  module,
  show,
  tooling,
  addons,
  help,
} from "./commands";
import { VERSION } from "./constants";

const program = new Command();

program
  .name("hanma")
  .description("Hanma CLI - Grapple your backend into shape")
  .version(VERSION);

program.addCommand(init);
program.addCommand(add);
program.addCommand(create);
program.addCommand(module);
program.addCommand(show);
program.addCommand(tooling);
program.addCommand(addons);
program.addCommand(help);

program.parse();
