package zsanctuary.shadow

default allow = false

allow if {
  input.formula_registry.status == "internal-only"
  input.folder_policy.mode == "internal-only"
  input.request_only_policy_present == true
}

deny[msg] if {
  input.formula_registry.status != "internal-only"
  msg := "formula registry must stay internal-only"
}

deny[msg] if {
  input.folder_policy.mode != "internal-only"
  msg := "folder manager policy must stay internal-only"
}

deny[msg] if {
  input.request_only_policy_present != true
  msg := "request-only access policy must exist"
}
