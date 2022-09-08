module.exports = {
  apps : [{
    name   : "pricer",
    script : "yarn",
    args   : "deploy",
    watch  : ["components", "lib", "pages", "public", "styles"]
  }]
}
