var final_runs = {};
var qlf_runs = {};
var url = "https://docs.google.com/a/loyet.net/spreadsheets/d/1si-AjcSVcKUKqHUqWiqmqdt2xPS1XMMPbjS8Fl3niaQ/export?gid=" + TABID + "&format=csv";
var loop_interval = 5000;
var loop_interval_error = 10000;

// default values
var stroke_color = '#a5a5a5';
var battle_width = 220;
var battle_height = 110;
var battle_sep_small = 10;
var battle_sep_large = 30;

// clone SVG battle
function battle_clone(battle, name, x, y, type = undefined) {
  var r = battle.clone().id(name);
  r.move(x,y);
  r.data('x', x)
  r.data('y', y);
  r.select('.title').first().text(name);
  if (typeof(type) == "string") r.select('.border0').first().addClass(type);
  return r;
}

// Create battle to reuse later
function create_battle(svg) {
  var battle = svg.group();
  battle.rect(battle_width, battle_height).radius(10, 10).addClass('border').addClass('border0');

  //battle.rect(battle_width - 2*battle_sep_small, battle_sep_large).radius(5,5).move(battle_sep_small, battle_sep_large).addClass('border').addClass('border1');
  battle.path("M20 34 h 180 q 10 0 10 10 v 15 l -10 10 h -180 l -10 -10 v -15 q 0 -10 10 -10").addClass('border').addClass('border1');
  battle.text("Pilot #1").move(battle_width/2, 40).addClass('pilot1');

  //battle.rect(battle_width - 2*battle_sep_small, battle_sep_large).radius(5,5).move(battle_sep_small, battle_height - battle_sep_large - battle_sep_small).addClass('border').addClass('border2');
  battle.path("M20 70 h 180 l 10 10 v 15 q 0 10 -10 10 h -180 q -10 0 -10 -10 v -15 l 10 -10").addClass('border').addClass('border2');
  battle.text("Pilot #2").move(battle_width/2, 78).addClass('pilot2');

  battle.text("TITLE").move(battle_width/2, battle_sep_small/2).addClass('title');

  return battle;
}

// change SVG text in battle
function text(battle, type, str) {
  var c = ".title";
  if (type == 1) c = ".pilot1";
  if (type == 2) c = ".pilot2";
  battle.select(c).first().text(str);
}

// rename battle
function rename_battle(svg, o, n) {
  var e = svg.select('#' + o).first();
  e.attr('id', n);
  e.select('.title').first().text(n);
  return e;
}

// draw connection between 2 battles
function conn(svg, start_group, start_position, end_group, end_position) {
  var start_border = start_group.select('.border0').first();
  var end_border = end_group.select('.border0').first();

  var start_x = start_group.data('x');
  var start_y = start_group.data('y');
  var end_x = end_group.data('x');
  var end_y = end_group.data('y');

  var s_x, s_y, e_x, e_y;

  switch(start_position) {
    case 'right':
      s_x = start_x + start_border.x() + start_border.width();
      s_y = start_y + start_border.y() + start_border.height()/2;
      break;
    case 'left':
      s_x = start_x + start_border.x();
      s_y = start_y + start_border.y() + start_border.height()/2;
      break;
    case 'top-right':
      s_x = start_x + start_border.x() + start_border.width() - battle_sep_small;
      s_y = start_y + start_border.y();
      break;
    case 'top-left':
      s_x = start_x + start_border.x() + battle_sep_small;
      s_y = start_y + start_border.y();
      break;
    case 'bottom-right':
      s_x = start_x + start_border.x() + start_border.width() - battle_sep_small;
      s_y = start_y + start_border.y() + start_border.height();
      break;
    case 'bottom-left':
      s_x = start_x + start_border.x() + battle_sep_small;
      s_y = start_y + start_border.y() + start_border.height();
      break;
    default:
      alert('Wrong position value: ' + start_position);
  }

  switch(end_position) {
    case 'right':
      e_x = end_x + end_border.x() + end_border.width();
      e_y = end_y + end_border.y() + end_border.height()/2;
      break;
    case 'left':
      e_x = end_x + end_border.x();
      e_y = end_y + end_border.y() + end_border.height()/2;
      break;
    case 'top-right':
      e_x = end_x + end_border.x() + end_border.width() - battle_sep_small;
      e_y = end_y + end_border.y();
      break;
    case 'top-left':
      e_x = end_x + end_border.x() + battle_sep_small;
      e_y = end_y + end_border.y();
      break;
    case 'bottom-right':
      e_x = end_x + end_border.x() + end_border.width() - battle_sep_small;
      e_y = end_y + end_border.y() + end_border.height();
      break;
    case 'bottom-left':
      e_x = end_x + end_border.x() + battle_sep_small;
      e_y = end_y + end_border.y() + end_border.height();
      break;
    default:
      alert('Wrong position value ' + end_position);
  }

  var path = "M" + s_x + " " + s_y;

  if (start_position == 'left' && s_x < e_x) {
    path += "h -30";
    start_position = '-';
  }

  if (start_position == 'right' && s_x > e_x) {
    path += "h 30";
    start_position = '-';
  }

  if (start_position.indexOf('-') >= 0) {
    path += " V" + e_y + " H" + e_x;
  } else {
    path += " H" + e_x + " V" + e_y;
  }

  var line = svg.path(path);

  line.marker('end', 20, 20,function(add) {
    add.circle(5).center(4, 6)
    add.circle(5).center(8, 8)
    add.circle(5).center(12, 10)
    add.circle(5).center(8, 12)
    add.circle(5).center(4, 14)
    this.size(5,5);
//    add.polygon('2,0 4,8 6,0');
  });

  return line;
}


function update_battle(battle, p1, s1, p2, s2) {

  // convert string to float otherwise comparison will be wrong
  s1 = parseFloat(s1.replace(/,/, '.'));
  s2 = parseFloat(s2.replace(/,/, '.'));

  if (isNaN(s1)) s1 = -1;
  if (isNaN(s2)) s2 = -1;

//  if (battle.attr('id').match(/^A/)) console.log("Update " + battle.attr('id') + " " + p1 + "/" + s1 + "  " + p2 + "/" + s2);

  var t1 = battle.select('.pilot1').first().text(p1);
  var b1 = battle.select('.border1').first();
  if (p1.match(/(loser|winner|group)/i)) {
    b1.removeClass("announced");
  } else {
    b1.addClass("announced");
  }

  var t2 = battle.select('.pilot2').first().text(p2);
  var b2 = battle.select('.border2').first();
  if (p2.match(/(loser|winner|group)/i)) {
    b2.removeClass("announced");
  } else {
    b2.addClass("announced");
  }

  var b = battle.select('.border0').first();
  var t = battle.select('.title').first();

  if (s1 < 0 || s2 < 0) {
    t1.removeClass("loser").removeClass("winner");
    b1.removeClass("loser").removeClass("winner");

    t2.removeClass("loser").removeClass("winner");
    b2.removeClass("loser").removeClass("winner");
    t.removeClass("ongoing").removeClass("finished");
    b.removeClass("ongoing").removeClass("finished");
    return 0; // battle has not happened yet
  }

  if (s1 > s2) {
    t1.removeClass("loser").addClass("winner");
    b1.removeClass("loser").addClass("winner");

    t2.addClass("loser").removeClass("winner");
    b2.addClass("loser").removeClass("winner");
  } else {
    t2.removeClass("loser").addClass("winner");
    b2.removeClass("loser").addClass("winner");

    t1.addClass("loser").removeClass("winner");
    b1.addClass("loser").removeClass("winner");
  }
  t.addClass("ongoing");
  b.addClass("finished");
  return 1; // the battle is finished
}
