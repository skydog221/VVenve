import vm from "$/vm";
import { wrapVM } from "src/api/vm";

export const isVMObtained = !!vm;

export const wrappedVM = vm ? wrapVM(vm) : null;
