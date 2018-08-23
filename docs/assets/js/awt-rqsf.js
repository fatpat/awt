var final_runs = {};
var qlf_runs = {};
var TABID = "1783068895";
var url = "https://docs.google.com/a/loyet.net/spreadsheets/d/1si-AjcSVcKUKqHUqWiqmqdt2xPS1XMMPbjS8Fl3niaQ/export?gid=" + TABID + "&format=csv";

// default values
var stroke_color = '#a5a5a5';
var battle_width = 220;
var battle_height = 110;
var battle_sep_small = 10;
var battle_sep_large = 30;

// clone SVG battle
function battle_clone(battle, name, x, y) {
  var r = battle.clone().id(name);
  r.move(x,y);
  r.data('x', x)
  r.data('y', y);
  r.select('.title').first().text(name);
  return r;
}

// Create battle to reuse later
function create_battle(svg) {
  var battle = svg.group();
  battle.rect(battle_width, battle_height).radius(10, 10).addClass('border0');

  battle.rect(battle_width - 2*battle_sep_small, battle_sep_large).move(battle_sep_small, battle_sep_large).addClass('border1');
  battle.text("Pilot #1").move(battle_width/2, battle_sep_small+battle_sep_large).addClass('pilot1');

  battle.rect(battle_width - 2*battle_sep_small, battle_sep_large).move(battle_sep_small, battle_height - battle_sep_large - battle_sep_small).addClass('border2');
  battle.text("Pilot #2").move(battle_width/2, (battle_sep_small+battle_sep_large)*2).addClass('pilot2');

  battle.text("TITLE").move(battle_width/2, battle_sep_small).addClass('title');

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

  // convert string to int otherwise comparison will be wrong
  s1 = parseInt(s1);
  s2 = parseInt(s2);
  if (isNaN(s1)) s1 = -1;
  if (isNaN(s2)) s2 = -1;

//  if (battle.attr('id').match(/^A/)) console.log("Update " + battle.attr('id') + " " + p1 + "/" + s1 + "  " + p2 + "/" + s2);

  var t1 = battle.select('.pilot1').first().text(p1);
  var b1 = battle.select('.border1').first();
  if (p1.match(/(loser|winner)/i)) {
    b1.removeClass("announced");
  } else {
    b1.addClass("announced");
  }

  var t2 = battle.select('.pilot2').first().text(p2);
  var b2 = battle.select('.border2').first();
  if (p2.match(/(loser|winner)/i)) {
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

// handle periodic fectching data from google drive
function run_loop(interval) {
  window.setTimeout(function() {
    Papa.parse(url, {
      download: true,
      complete: function(results, file) {
        //console.log("Parsing complete:", results, file);
        var d = results.data;

        $('p.section').addClass('animated').addClass('bounce');

        // ** Groups **
        // Group A
        $( '#pilot-A1' ).text(d[4][4]);
        $( '#pilot-A2' ).text(d[5][4]);
        $( '#pilot-A3' ).text(d[6][4]);
        $( '#pilot-A4' ).text(d[7][4]);

        // Group C
        $( '#pilot-C1' ).text(d[4][5]);
        $( '#pilot-C2' ).text(d[5][5]);
        $( '#pilot-C3' ).text(d[6][5]);
        $( '#pilot-C4' ).text(d[7][5]);

        // Group R
        $( '#pilot-R1' ).text(d[4][6]);
        $( '#pilot-R2' ).text(d[5][6]);
        $( '#pilot-R3' ).text(d[6][6]);
        $( '#pilot-R4' ).text(d[7][6]);

        // Group O
        $( '#pilot-O1' ).text(d[4][7]);
        $( '#pilot-O2' ).text(d[5][7]);
        $( '#pilot-O3' ).text(d[6][7]);
        $( '#pilot-O4' ).text(d[7][7]);

        // ** qualification runs **
        for (var g=0; g<4; g++) {
          for (var i=0; i<6; i++) {

            var l = 'A';
            var x = 23;
            if (g == 1) { x = 28; l = 'C'; }
            if (g == 2) { x = 33; l = 'R'; }
            if (g == 3) { x = 38; l = 'O'; }

            var y = 1;
            if (i>=2 && i<=3) y = 4;
            if (i>=4) y = 7;

            update_battle(qlf_runs[l + (i+1)], d[x + (i%2)*2][y], d[x + (i%2)*2][y+1], d[x + (i%2*2) + 1][y], d[x + (i%2)*2 + 1][y+1]);
          }
        }

        // quarters
        for (var q=0; q<4; q++) {
          var x = 53;
          if (q == 1) x = 56;
          if (q == 2) x = 59;
          if (q == 3) x = 62;
          update_battle(final_runs["Q" + (q+1)], d[x][1], d[x][2], d[x+1][1], d[x+1][2]);
        }

        // C1-C10
        for (var i=0; i<10; i++) {
          var x = 67;
          var y = 4;
          if (i == 1) { x=70; y=4; }
          if (i == 2) { x=53; y=4; }
          if (i == 3) { x=56; y=4; }
          if (i == 4) { x=59; y=4; }
          if (i == 5) { x=62; y=4; }
          if (i == 6) { x=67; y=7; }
          if (i == 7) { x=70; y=7; }
          if (i == 8) { x=75; y=7; }
          if (i == 9) { x=78; y=7; }
          update_battle(final_runs["C" + (i+1)], d[x][y], d[x][y+1], d[x+1][y], d[x+1][y+1]);
        }


        // S1-S2
        for (var i=0; i<2; i++) {
          var x = 67;
          var y = 1;
          if (i == 1) { x=70; y=1; }
          update_battle(final_runs["S" + (i+1)], d[x][y], d[x][y+1], d[x+1][y], d[x+1][y+1]);
        }

        // F1,F3,F5,F7,F9,F11,F13,F15
        for (var i=0; i<8; i++) {
          var x = 83;
          var y = 1;
          if (i == 1) { x=86; y=1; }
          if (i == 2) { x=89; y=1; }
          if (i == 3) { x=92; y=1; }
          if (i == 4) { x=83; y=4; }
          if (i == 5) { x=86; y=4; }
          if (i == 6) { x=89; y=4; }
          if (i == 7) { x=92; y=4; }
          update_battle(final_runs["F" + (i*2 + 1)], d[x][y], d[x][y+1], d[x+1][y], d[x+1][y+1]);
        }

        // ** qualification results **
        // Group A
        $( '#result-A1' ).text(d[46][3]);
        $( '#result-A2' ).text(d[47][3]);
        $( '#result-A3' ).text(d[48][3]);
        $( '#result-A4' ).text(d[49][3]);

        // Group C
        $( '#result-C1' ).text(d[46][4]);
        $( '#result-C2' ).text(d[47][4]);
        $( '#result-C3' ).text(d[48][4]);
        $( '#result-C4' ).text(d[49][4]);

        // Group R
        $( '#result-R1' ).text(d[46][5]);
        $( '#result-R2' ).text(d[47][5]);
        $( '#result-R3' ).text(d[48][5]);
        $( '#result-R4' ).text(d[49][5]);

        // Group O
        $( '#result-O1' ).text(d[46][6]);
        $( '#result-O2' ).text(d[47][6]);
        $( '#result-O3' ).text(d[48][6]);
        $( '#result-O4' ).text(d[49][6]);

        // ** final runs **

        // ** final results **
        $( '#result-p1' ).text(d[97][2]);
        $( '#result-p2' ).text(d[98][2]);
        $( '#result-p3' ).text(d[99][2]);
        $( '#result-p4' ).text(d[100][2]);
        $( '#result-p5' ).text(d[101][2]);
        $( '#result-p6' ).text(d[102][2]);
        $( '#result-p7' ).text(d[103][2]);
        $( '#result-p8' ).text(d[104][2]);
        $( '#result-p9' ).text(d[105][2]);
        $( '#result-p10' ).text(d[106][2]);
        $( '#result-p11' ).text(d[107][2]);
        $( '#result-p12' ).text(d[108][2]);
        $( '#result-p13' ).text(d[109][2]);
        $( '#result-p14' ).text(d[110][2]);
        $( '#result-p15' ).text(d[111][2]);
        $( '#result-p16' ).text(d[112][2]);
        
        // refresh data in 5s
        run_loop(5000);
      },
      error: function(error, file) {
        console.log("Parsing error:", error, file);
        //run_loop(10000);
      },
    });
  }, interval);
}

// When browser is ready !
window.onload = function() {
  if (!SVG.supported) {
    alert("SVG not supported, please use a modern internet browser, dummy !");
    return;
  }

  // init SVG for '1st to 8th finals'
  var finals = SVG('svg-finals-1-8').size(1360, 550).viewbox(0,0,1360,550);

  // Create battle to reuse later
  var battle = create_battle(finals);

  // create each battle from the battle
  var Q1 = battle_clone(battle, 'Q1', battle_sep_large, battle_sep_small);
  var Q2 = battle_clone(battle, 'Q2', finals.width()-battle_width-battle_sep_large, battle_sep_small);
  var Q3 = battle_clone(battle, 'Q3', finals.width()-battle_width-battle_sep_large, battle_sep_small+battle_height+battle_sep_large);
  var Q4 = battle_clone(battle, 'Q4', battle_sep_large, battle_sep_small+battle_height+battle_sep_large);

  var F1 = battle_clone(battle, 'F1', (finals.width()-battle_width)/2, battle_sep_small);
var F3 = battle_clone(battle, 'F3', (finals.width()-battle_width)/2, battle_sep_small + battle_height + battle_sep_large);
  var F5 = battle_clone(battle, 'F5', (finals.width()-battle_width)/2, battle_sep_small + (battle_height + battle_sep_large)*2);
  var F7 = battle_clone(battle, 'F7', (finals.width()-battle_width)/2, battle_sep_small + (battle_height + battle_sep_large)*3);

  var semi_pad = ((finals.width() - battle_width)/2 - battle_width)/2 - battle_width/2 + battle_sep_large;
  var S1 = battle_clone(battle, 'S1', battle_width + semi_pad, battle_sep_small + battle_height+battle_sep_large/2 -battle_height/2);
  var S2 = battle_clone(battle, 'S2', finals.width() - battle_width*2 - semi_pad, battle_sep_small + battle_height+battle_sep_large/2 -battle_height/2);

  var C1 = battle_clone(battle, 'C1', battle_width + semi_pad, battle_sep_small + (battle_height+battle_sep_large)*3 - battle_sep_large/2 - battle_height/2);
  var C2 = battle_clone(battle, 'C2', finals.width() - battle_width*2 - semi_pad, battle_sep_small + (battle_height+battle_sep_large)*3 - battle_sep_large/2 - battle_height/2);

  // update text
  text(Q1, 1, "1st Group A");
  text(Q1, 2, "2nd Group O");

  text(Q2, 1, "2nd Group A");
  text(Q2, 2, "1st Group O");

  text(Q3, 1, "1st Group C");
  text(Q3, 2, "2nd Group R");

  text(Q4, 1, "2nd Group C");
  text(Q4, 2, "1st Group R");

  text(S1, 1, "Winner Q1");
  text(S1, 2, "Winner Q4");

  text(S2, 1, "Winner Q2");
  text(S2, 2, "Winner Q3");

  text(C1, 1, "Loser Q1");
  text(C1, 2, "Loser Q4");

  text(C2, 1, "Loser Q2");
  text(C2, 2, "Loser Q3");

  text(F1, 1, "Winner S1");
  text(F1, 2, "Winner S2");

  text(F3, 1, "Loser S1");
  text(F3, 2, "Loser S2");

  text(F5, 1, "Winner C1");
  text(F5, 2, "Winner C2");

  text(F7, 1, "Loser C1");
  text(F7, 2, "Loser C2");

  // remove as it's not necessary anymore
  battle.remove();


  // draw connections
  conn(finals, Q1, "right", S1, "top-left").addClass("winner");
  conn(finals, Q4, "right", S1, "bottom-left").addClass("winner");
  conn(finals, Q2, "left", S2, "top-right").addClass("winner");
  conn(finals, Q3, "left", S2, "bottom-right").addClass("winner");

  conn(finals, S1, "top-right", F1, "left").addClass("winner");
  conn(finals, S2, "top-left", F1, "right").addClass("winner");
  conn(finals, S1, "bottom-right", F3, "left").addClass("loser");
  conn(finals, S2, "bottom-left", F3, "right").addClass("loser");

  conn(finals, C1, "top-right", F5, "left").addClass("winner");
  conn(finals, C2, "top-left", F5, "right").addClass("winner");
  conn(finals, C1, "bottom-right", F7, "left").addClass("loser");
  conn(finals, C2, "bottom-left", F7, "right").addClass("loser");

  conn(finals, Q1, "left", C1, "left").addClass("loser");
  conn(finals, Q4, "left", C1, "left").addClass("loser");
  conn(finals, Q2, "right", C2, "right").addClass("loser");
  conn(finals, Q3, "right", C2, "right").addClass("loser");


  // clone div#svg-finals-1-8 into section#finals-9-16
  $("#svg-finals-1-8").clone().appendTo("#finals-9-16");
  // update IDs
  $("#finals-9-16 > div").attr('id', "div-svg-finals-9-16");
  $("#finals-9-16 > div > svg").attr('id', "svg-finals-9-16");

  // got cloned SVG
  finals2 = SVG.select('#svg-finals-9-16').first();

  // rename battles
  var C3  = rename_battle(finals2, "Q1", "C3");
  var C4  = rename_battle(finals2, "Q2", "C4");
  var C5  = rename_battle(finals2, "Q3", "C5");
  var C6  = rename_battle(finals2, "Q4", "C6");
  var C9  = rename_battle(finals2, "S1", "C9");
  var C10 = rename_battle(finals2, "S2", "C10");
  var C7  = rename_battle(finals2, "C1", "C7");
  var C8  = rename_battle(finals2, "C2", "C8");
  var F9  = rename_battle(finals2, "F1", "F9");
  var F11 = rename_battle(finals2, "F3", "F11");
  var F13 = rename_battle(finals2, "F5", "F13");
  var F15 = rename_battle(finals2, "F7", "F15");

  // update pilot's name
  text(C3, 1, "3rd Group A");
  text(C3, 2, "4th Group O");

  text(C4, 1, "4th Group A");
  text(C4, 2, "3rd Group O");

  text(C5, 1, "3rd Group C");
  text(C5, 2, "4th Group R");

  text(C6, 1, "4th Group C");
  text(C6, 2, "3rd Group R");

  text(C7, 1, "Loser C3");
  text(C7, 2, "Loser C6");

  text(C8, 1, "Loser C4");
  text(C8, 2, "Loser C5");

  text(C9, 1, "Winner C3");
  text(C9, 2, "Winner C6");

  text(C10, 1, "Winner C4");
  text(C10, 2, "Winner C5");

  text(F9, 1, "Winner C9");
  text(F9, 2, "Winner C10");

  text(F11, 1, "Loser C9");
  text(F11, 2, "Loser C10");

  text(F13, 1, "Winner C7");
  text(F13, 2, "Winner C8");

  text(F15, 1, "Loser C7");
  text(F15, 2, "Loser C8");

  // save each battle
  final_runs = {C1:C1,C2:C2,C3:C3,C4:C4,C5:C5,C6:C6,C7:C7,C8:C8,C9:C9,C10:C10,Q1:Q1,Q2:Q2,Q3:Q3,Q4:Q4,S1:S1,S2:S2,F1:F1,F3:F3,F5:F5,F7:F7,F9:F9,F11:F11,F13:F13,F15:F15};


  // Create qualification runs
  var qlf = SVG('svg-qualifications').size(1050, 810).viewbox(0,0,1050,810);

  var battle = create_battle(qlf);

  var Y = battle_sep_large + battle_sep_small*2;
  // group A
  var x = battle_sep_small + battle_sep_large*2;
  var y = Y;
  var A1 = battle_clone(battle, 'A1', x, y);
  y += battle_height + battle_sep_small;
  var A2 = battle_clone(battle, 'A2', x, y);
  y += battle_height + battle_sep_large;
  var A3 = battle_clone(battle, 'A3', x, y);
  y += battle_height + battle_sep_small;
  var A4 = battle_clone(battle, 'A4', x, y);
  y += battle_height + battle_sep_large;
  var A5 = battle_clone(battle, 'A5', x, y);
  y += battle_height + battle_sep_small;
  var A6 = battle_clone(battle, 'A6', x, y);

  // group C
  var x = battle_sep_small + battle_sep_large*2 + (battle_sep_large + battle_width);
  var y = Y;
  var C1 = battle_clone(battle, 'C1', x, y);
  y += battle_height + battle_sep_small;
  var C2 = battle_clone(battle, 'C2', x, y);
  y += battle_height + battle_sep_large;
  var C3 = battle_clone(battle, 'C3', x, y);
  y += battle_height + battle_sep_small;
  var C4 = battle_clone(battle, 'C4', x, y);
  y += battle_height + battle_sep_large;
  var C5 = battle_clone(battle, 'C5', x, y);
  y += battle_height + battle_sep_small;
  var C6 = battle_clone(battle, 'C6', x, y);

  // group R
  var x = battle_sep_small + battle_sep_large*2 + (battle_sep_large + battle_width)*2;
  var y = Y;
  var R1 = battle_clone(battle, 'R1', x, y);
  y += battle_height + battle_sep_small;
  var R2 = battle_clone(battle, 'R2', x, y);
  y += battle_height + battle_sep_large;
  var R3 = battle_clone(battle, 'R3', x, y);
  y += battle_height + battle_sep_small;
  var R4 = battle_clone(battle, 'R4', x, y);
  y += battle_height + battle_sep_large;
  var R5 = battle_clone(battle, 'R5', x, y);
  y += battle_height + battle_sep_small;
  var R6 = battle_clone(battle, 'R6', x, y);

  // group O
  var x = battle_sep_small + battle_sep_large*2 + (battle_sep_large + battle_width)*3;
  var y = Y;
  var O1 = battle_clone(battle, 'O1', x, y);
  y += battle_height + battle_sep_small;
  var O2 = battle_clone(battle, 'O2', x, y);
  y += battle_height + battle_sep_large;
  var O3 = battle_clone(battle, 'O3', x, y);
  y += battle_height + battle_sep_small;
  var O4 = battle_clone(battle, 'O4', x, y);
  y += battle_height + battle_sep_large;
  var O5 = battle_clone(battle, 'O5', x, y);
  y += battle_height + battle_sep_small;
  var O6 = battle_clone(battle, 'O6', x, y);

  // remove useless template
  battle.remove();

  // add TITLES
  qlf.text("A").move(A1.data('x') + battle_width/2, battle_sep_large).addClass('title').addClass('title_group');
  qlf.text("C").move(C1.data('x') + battle_width/2, battle_sep_large).addClass('title').addClass('title_group');
  qlf.text("R").move(R1.data('x') + battle_width/2, battle_sep_large).addClass('title').addClass('title_group');
  qlf.text("O").move(O1.data('x') + battle_width/2, battle_sep_large).addClass('title').addClass('title_group');

  qlf.text("RUN 1").move(battle_sep_large + battle_sep_small, A2.data('y') - battle_sep_small).addClass('title').addClass('title_run').rotate(270);
  qlf.text("RUN 2").move(battle_sep_large + battle_sep_small, A4.data('y') - battle_sep_small).addClass('title').addClass('title_run').rotate(270);
  qlf.text("RUN 3").move(battle_sep_large + battle_sep_small, A6.data('y') - battle_sep_small).addClass('title').addClass('title_run').rotate(270);

  // save runs
  qlf_runs = {A1:A1,A2:A2,A3:A3,A4:A4,A5:A5,A6:A6,C1:C1,C2:C2,C3:C3,C4:C4,C5:C5,C6:C6,R1:R1,R2:R2,R3:R3,R4:R4,R5:R5,R6:R6,O1:O1,O2:O2,O3:O3,O4:O4,O5:O5,O6:O6}

  // run main loop that will fetch data and update the current page
  run_loop(0);

  //$( 'rect' ).click(function() { run_loop(0); });
};
