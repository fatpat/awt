// handle periodic fectching data from google drive
function run_loop(interval) {

  window.setTimeout(function() {
    gtag('config', 'UA-1246059-5');
    Papa.parse(url, {
      download: true,
      complete: function(results, file) {
        console.log("Parsing complete:", results, file);
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

        // S1-S2 C1-C6
        for (var i=0; i<8; i++) {
          var x = 53;
          var y = 1;
          var l = "S1";
          if (i == 0) { x=53; y=1; l="S1"}
          if (i == 1) { x=56; y=1; l="S2"}
          if (i == 2) { x=60; y=1; l="C1"}
          if (i == 3) { x=63; y=1; l="C2"}
          if (i == 4) { x=53; y=4; l="C3"}
          if (i == 5) { x=56; y=4; l="C4"}
          if (i == 6) { x=60; y=4; l="C5"}
          if (i == 7) { x=63; y=4; l="C6"}
          update_battle(final_runs[l], d[x][y], d[x][y+1], d[x+1][y], d[x+1][y+1]);
        }

        // F1,F3,F5,F7,F9,F11,F13,F15
        for (var i=0; i<8; i++) {
          var x = 68;
          var y = 1;
          if (i == 1) { x=71; y=1; }
          if (i == 2) { x=74; y=1; }
          if (i == 3) { x=77; y=1; }
          if (i == 4) { x=68; y=4; }
          if (i == 5) { x=71; y=4; }
          if (i == 6) { x=74; y=4; }
          if (i == 7) { x=77; y=4; }
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
        $( '#result-p1' ).text(d[82][2]);
        $( '#result-p2' ).text(d[83][2]);
        $( '#result-p3' ).text(d[84][2]);
        $( '#result-p4' ).text(d[85][2]);
        $( '#result-p5' ).text(d[86][2]);
        $( '#result-p6' ).text(d[87][2]);
        $( '#result-p7' ).text(d[88][2]);
        $( '#result-p8' ).text(d[89][2]);
        $( '#result-p9' ).text(d[90][2]);
        $( '#result-p10' ).text(d[91][2]);
        $( '#result-p11' ).text(d[92][2]);
        $( '#result-p12' ).text(d[93][2]);
        $( '#result-p13' ).text(d[94][2]);
        $( '#result-p14' ).text(d[95][2]);
        $( '#result-p15' ).text(d[96][2]);
        $( '#result-p16' ).text(d[97][2]);

        // refresh data in 5s
        run_loop(loop_interval);
      },
      error: function(error, file) {
        console.log("Parsing error:", error, file);
        run_loop(loop_interval_error);
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
  var finals = SVG('svg-finals-runs').size(770, 1110).viewbox(0,0,770,1110);

  // Create battle to reuse later
  var battle = create_battle(finals);

  // create each battle from the battle

  var x = (finals.width()-battle_width)/2;
  var y = function(n) {return battle_sep_small + (battle_height + battle_sep_large)*(n-1); };
  var F1  = battle_clone(battle, 'F1',  x, y(1), "final");
  var F3  = battle_clone(battle, 'F3',  x, y(2), "final");
  var F5  = battle_clone(battle, 'F5',  x, y(3), "final");
  var F7  = battle_clone(battle, 'F7',  x, y(4), "final");
  var F9  = battle_clone(battle, 'F9',  x, y(5), "final");
  var F11 = battle_clone(battle, 'F11', x, y(6), "final");
  var F13 = battle_clone(battle, 'F13', x, y(7), "final");
  var F15 = battle_clone(battle, 'F15', x, y(8), "final");

  var x1 = battle_sep_small;
  var x2 = finals.width() - battle_width - battle_sep_small;
  var y = function(n) { return battle_sep_small + 2*(battle_height + battle_sep_large)*(n-1) + battle_height + battle_sep_large/2 - battle_height/2; };

  var S1 = battle_clone(battle, 'S1', x1, y(1), "semi");
  var S2 = battle_clone(battle, 'S2', x2, y(1), "semi");

  var C1 = battle_clone(battle, 'C1', x1, y(2), "semi");
  var C2 = battle_clone(battle, 'C2', x2, y(2), "semi");

  var C3 = battle_clone(battle, 'C3', x1, y(3), "semi");
  var C4 = battle_clone(battle, 'C4', x2, y(3), "semi");

  var C5 = battle_clone(battle, 'C5', x1, y(4), "semi");
  var C6 = battle_clone(battle, 'C6', x2, y(4), "semi");

  // update text
  text(S1, 1, "1st Group A");
  text(S1, 2, "1st Group O");

  text(S2, 1, "1st Group C");
  text(S2, 2, "1st Group R");

  text(C1, 1, "2nd Group A");
  text(C1, 2, "2nd Group O");

  text(C2, 1, "2nd Group C");
  text(C2, 2, "2nd Group R");

  text(C3, 1, "3rd Group A");
  text(C3, 2, "3rd Group O");

  text(C4, 1, "3rd Group C");
  text(C4, 2, "3rd Group R");

  text(C5, 1, "4th Group A");
  text(C5, 2, "4th Group O");

  text(C6, 1, "4th Group C");
  text(C6, 2, "4th Group R");

  text(F1, 1, "Winner S1");
  text(F1, 2, "Winner S2");

  text(F3, 1, "Loser S1");
  text(F3, 2, "Loser S2");

  text(F5, 1, "Winner C1");
  text(F5, 2, "Winner C2");

  text(F7, 1, "Loser C1");
  text(F7, 2, "Loser C2");

  text(F9, 1, "Winner C3");
  text(F9, 2, "Winner C4");

  text(F11, 1, "Loser C3");
  text(F11, 2, "Loser C4");

  text(F13, 1, "Winner C5");
  text(F13, 2, "Winner C6");

  text(F15, 1, "Loser C5");
  text(F15, 2, "Loser C6");

  // remove as it's not necessary anymore
  battle.remove();


  // draw connections
  conn(finals, S1, "top-right",    F1, "left" ).addClass("winner");
  conn(finals, S2, "top-left",     F1, "right").addClass("winner");
  conn(finals, S1, "bottom-right", F3, "left" ).addClass("loser");
  conn(finals, S2, "bottom-left",  F3, "right").addClass("loser");

  conn(finals, C1, "top-right",    F5, "left" ).addClass("winner");
  conn(finals, C2, "top-left",     F5, "right").addClass("winner");
  conn(finals, C1, "bottom-right", F7, "left" ).addClass("loser");
  conn(finals, C2, "bottom-left",  F7, "right").addClass("loser");

  conn(finals, C3, "top-right",    F9, "left" ).addClass("winner");
  conn(finals, C4, "top-left",     F9, "right").addClass("winner");
  conn(finals, C3, "bottom-right", F11,"left" ).addClass("loser");
  conn(finals, C4, "bottom-left",  F11, "right").addClass("loser");

  conn(finals, C5, "top-right",    F13, "left" ).addClass("winner");
  conn(finals, C6, "top-left",     F13, "right").addClass("winner");
  conn(finals, C5, "bottom-right", F15, "left" ).addClass("loser");
  conn(finals, C6, "bottom-left",  F15, "right").addClass("loser");



  // save each battle
  final_runs = {C1:C1,C2:C2,C3:C3,C4:C4,C5:C5,C6:C6,S1:S1,S2:S2,F1:F1,F3:F3,F5:F5,F7:F7,F9:F9,F11:F11,F13:F13,F15:F15};


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
