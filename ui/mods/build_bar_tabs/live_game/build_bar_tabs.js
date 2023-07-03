
console.log("loaded build bar tabs")

var tabLabels = ["MLA","BUGS","LEGION"];

//var tabUnitTypes = ["Custom58","Custom2","Custom1"];

var activeTab = "MLA"

var activeTabNumber = 0;

var tempActiveTab = "MLA"


$.get("coui://ui/mods/build_bar_tabs/live_game/build_bar_tabs.html", function (html) {
		$(".div_build_bar_hide").prepend(html);
})

multipleFactions = ko.observable(false)

model.toggleFaction = function(){
  activeTab = tabLabels[(activeTabNumber+=1)%3]
  console.log(activeTab)
  if(model.buildSet() !== undefined){
    var tempSpecs = model.buildSet().selectedSpecs();
    model.buildSet().selectedSpecs({})
    model.buildSet().selectedSpecs(tempSpecs)
  }
  var factionLogoLocations = ["mla","bugs","legion"];
  $("#activeFaction").attr("src", "coui://ui/mods/build_bar_tabs/live_game/img/"+factionLogoLocations[activeTabNumber%3]+".png");
 
}

multipleFactions(false);

var splitBuildBar = ko.computed(function(){

  
  var groupTabs = model.buildSet();
  if(groupTabs == undefined){return}
  var buildBarOpen = !model.buildSet().empty()
  groupTabs = groupTabs.tabsByGroup()
  var tempActiveTab = "NONE"
  var tabKeys = _.keys(groupTabs)
  var activeFaction = {
    "mla":false,
    "bugs":false,
    "legion":false
  };

  _.forEach(tabKeys,function(tabKey){
      if(tabKey.startsWith("L_")  && groupTabs[tabKey].visible() == true){activeFaction.legion = true;}
      if(tabKey.startsWith("bug_") && groupTabs[tabKey].visible() == true){activeFaction.bugs = true}
      if(!tabKey.startsWith("L_") && !tabKey.startsWith("bug_") && groupTabs[tabKey].visible() == true){activeFaction.mla = true}
  })

  if(activeFaction.mla + activeFaction.bugs + activeFaction.legion > 1){multipleFactions(true)}

  if(multipleFactions() == false){$(".activeFaction").hide()}
  else{$(".activeFaction").show()}

  if(activeFaction.bugs == false && activeFaction.legion == false){tempActiveTab = "MLA"}
  if(activeFaction.bugs == false && activeFaction.legion == true && activeFaction.mla == false){tempActiveTab = "LEGION"}
  if(activeFaction.bugs == true && activeFaction.legion == false && activeFaction.mla == false){tempActiveTab = "BUGS"}
  if(tempActiveTab == "NONE"){tempActiveTab = activeTab}

  _.forEach(tabKeys,function(tabKey){
    if(tabKey.startsWith("L_") && tempActiveTab !== "LEGION"){groupTabs[tabKey].visible(false)}
    if(tabKey.startsWith("bug_")&& tempActiveTab !== "BUGS"){groupTabs[tabKey].visible(false)}
    if(!tabKey.startsWith("L_") && !tabKey.startsWith("bug_") && tempActiveTab !== "MLA"){groupTabs[tabKey].visible(false)}
  })

})