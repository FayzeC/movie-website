// mobile_menu
var menu = $('ul#navigation');
if(menu.length){
  menu.slicknav({
    prependTo: ".mobile_menu",
    closedSymbol: '+',
    openedSymbol:'-'
  });
};