// slideshow handling

var sections = ["#groups", "#qualification-runs", "#qualification-table", "#qualification-results", "#finals", "#finals-results"];
var sections_i = 0;
var slideshow_timeout = 20;
var slideshow = false;
var d = {};

function run_slideshow() {

//  $('.content-wrapper').css("maxWidth", "100%");
//  $('.node').css("padding-left", "0");

//  console.log(sections_i, sections);

  $('#page-header').hide();
  $('.breadcrumb-wrapper').hide();
  $('#page-footer').hide();

  for (var i=0; i<sections.length; i++) {
    $(sections[i]).hide();
  }

  var skip = sections[sections_i].length == 0;
  if (!skip) $(sections[sections_i]).show();

  sections_i = (sections_i + 1) % sections.length;

  window.setTimeout(function() {
    run_slideshow();
  }, skip ? 10 : slideshow_timeout * 1000);
}



// handle periodic fectching data from google drive
function run_loop(interval) {

  window.setTimeout(function() {
    gtag('config', 'UA-1246059-5');
    Papa.parse(url, {
      download: true,
      complete: function(results, file) {
//        console.log("Parsing complete:", results, file);
        d = results.data;

        $('p.section').addClass('animated').addClass('bounce');



        if (d[10][4] == "FALSE") {
          sections[3] = '';
          if (!slideshow) $('#qualification-results').hide();
        } else {
          sections[3] = '#qualification-results';
          if (!slideshow) $('#qualification-results').show();
        }

        if (d[11][4] == "FALSE") {
          sections[4] = '';
          if (!slideshow) $('#finals').hide();
        } else {
          sections[4] = '#finals';
          if (!slideshow) $('#finals').show();
        }


        if (d[12][4] == "FALSE") {
          sections[5] = '';
          if (!slideshow) $('#finals-results').hide();
        } else {
          sections[5] = '#finals-results';
          if (!slideshow) $('#finals-results').show();
        }

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

        // ** qualification runs **
        for (var g=0; g<3; g++) {
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


        // ** qualification table **
        for (var g=0; g<3; g++) {
          for (var p=0; p<4; p++) {
            $('#qualification-table table:nth-child(' + (g + 1) + ') tbody tr:nth-child(' + (p + 1) + ') th.name').text(d[23 + (g * 5) + p][10]);
            for (var r=0; r<3; r++) {
              var e = $('#qualification-table table:nth-child(' + (g + 1) + ') tbody tr:nth-child(' + (p + 1) + ') td.run' + (r + 1));
              if (d[23 + (g * 5) + p][16 + r] == "") {
                e.text('-');
                e.removeClass('loser').removeClass('winner');
              } else if (d[23 + (g * 5) + p][12 + r] == "FALSE") {
                e.text('Lose');
                e.removeClass('winner').addClass('loser');
              } else {
                e.text('Win');
                e.removeClass('loser').addClass('winner');
              }
            }

/*
            for (var r=0; r<3; r++) {
              var e = $('#qualification-table table:nth-child(' + (g + 1) + ') tbody tr:nth-child(' + (p + 1) + ') td.run' + (r + 1));
              e.text(d[23 + (g * 5) + p][16 + r]);
              if (d[23 + (g * 5) + p][12 + r] == "FALSE") {
                e.removeClass('winner').addClass('loser');
              } else {
                e.removeClass('loser').addClass('winner');
              }
            }
            $('#qualification-table table:nth-child(' + (g + 1) + ') tbody tr:nth-child(' + (p + 1) + ') td.average').text(d[23 + (g * 5) + p][19]);
*/
          }
        }

        // quarters
        for (var q=0; q<4; q++) {
          var x = 69;
          if (q == 1) x = 72;
          if (q == 2) x = 75;
          if (q == 3) x = 78;
          update_battle(final_runs["Q" + (q+1)], d[x][1], d[x][2], d[x+1][1], d[x+1][2]);
        }

        // S1-S2
        for (var i=0; i<2; i++) {
          var x = 83;
          var y = 1;
          if (i == 1) { x=86; y=1; }
          update_battle(final_runs["S" + (i+1)], d[x][y], d[x][y+1], d[x+1][y], d[x+1][y+1]);
        }

        // F1,F3
        for (var i=0; i<2; i++) {
          var x = 99;
          var y = 1;
          if (i == 1) { x=102; y=1; }
          update_battle(final_runs["F" + (i*2 + 1)], d[x][y], d[x][y+1], d[x+1][y], d[x+1][y+1]);
        }

        // ** qualification results **
        // Group A
        $( '#result-A1' ).text(d[46][3]);
        $( '#result-A2' ).text(d[47][3]);
        $( '#result-A3' ).text(d[48][3]);
        $( '#result-A4' ).text(d[49][3]);

        // Group C
        $( '#result-C1' ).text(d[46][5]);
        $( '#result-C2' ).text(d[47][5]);
        $( '#result-C3' ).text(d[48][5]);
        $( '#result-C4' ).text(d[49][5]);

        // Group R
        $( '#result-R1' ).text(d[46][7]);
        $( '#result-R2' ).text(d[47][7]);
        $( '#result-R3' ).text(d[48][7]);
        $( '#result-R4' ).text(d[49][7]);

        // ** final runs **

        // ** final results **
        $( '#result-p1' ).text(d[113][2]);
        $( '#result-p2' ).text(d[114][2]);
        $( '#result-p3' ).text(d[115][2]);
        $( '#result-p4' ).text(d[116][2]);
        $( '#result-p5' ).text(d[117][2]);
        $( '#result-p6' ).text(d[118][2]);
        $( '#result-p7' ).text(d[119][2]);
        $( '#result-p8' ).text(d[120][2]);
        $( '#result-p9' ).text(d[121][2]);
        $( '#result-p10' ).text(d[122][2]);
        $( '#result-p11' ).text(d[123][2]);
        $( '#result-p12' ).text(d[124][2]);

        // refresh data in 5s
        run_loop(loop_interval);
      },
      error: function(error, file) {
        console.log("Parsing error:", error, file);
        // run_loop(loop_interval_error);
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
  var finals = SVG('svg-finals').size(1360, 550).viewbox(0,0,1360,550);

  // Create battle to reuse later
  var battle = create_battle(finals);

  // create each battle from the battle
  var Q1 = battle_clone(battle, 'Q1', battle_sep_large, battle_sep_small, "quarter");
  var Q2 = battle_clone(battle, 'Q2', finals.width()-battle_width-battle_sep_large, battle_sep_small, "quarter");
  var Q3 = battle_clone(battle, 'Q3', finals.width()-battle_width-battle_sep_large, battle_sep_small+battle_height+battle_sep_large, "quarter");
  var Q4 = battle_clone(battle, 'Q4', battle_sep_large, battle_sep_small+battle_height+battle_sep_large, "quarter");

  var F1 = battle_clone(battle, 'F1', (finals.width()-battle_width)/2, battle_sep_small, "final");
  var F3 = battle_clone(battle, 'F3', (finals.width()-battle_width)/2, battle_sep_small + battle_height + battle_sep_large, "final");

  var semi_pad = ((finals.width() - battle_width)/2 - battle_width)/2 - battle_width/2 + battle_sep_large;
  var S1 = battle_clone(battle, 'S1', battle_width + semi_pad, battle_sep_small + battle_height+battle_sep_large/2 -battle_height/2, "semi");
  var S2 = battle_clone(battle, 'S2', finals.width() - battle_width*2 - semi_pad, battle_sep_small + battle_height+battle_sep_large/2 -battle_height/2, "semi");


  // update text
  text(Q1, 1, "1st Group A");
  text(Q1, 2, "2nd Group O");
  //Q1.addClass("quarter");

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

  text(F1, 1, "Winner S1");
  text(F1, 2, "Winner S2");

  text(F3, 1, "Loser S1");
  text(F3, 2, "Loser S2");

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


  // save each battle
  final_runs = {Q1:Q1,Q2:Q2,Q3:Q3,Q4:Q4,S1:S1,S2:S2,F1:F1,F3:F3};


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
  var x = battle_sep_small + battle_sep_large*2 + (4*battle_sep_large + battle_width);
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
  var x = battle_sep_small + battle_sep_large*2 + (4*battle_sep_large + battle_width)*2;
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

  // remove useless template
  battle.remove();

  // add TITLES
  qlf.text("A").move(A1.data('x') + battle_width/2, battle_sep_large).addClass('title').addClass('title_group');
  qlf.text("C").move(C1.data('x') + battle_width/2, battle_sep_large).addClass('title').addClass('title_group');
  qlf.text("R").move(R1.data('x') + battle_width/2, battle_sep_large).addClass('title').addClass('title_group');

  qlf.text("RUN 1").move(battle_sep_large + battle_sep_small, A2.data('y') - battle_sep_small).addClass('title').addClass('title_run').rotate(270);
  qlf.text("RUN 2").move(battle_sep_large + battle_sep_small, A4.data('y') - battle_sep_small).addClass('title').addClass('title_run').rotate(270);
  qlf.text("RUN 3").move(battle_sep_large + battle_sep_small, A6.data('y') - battle_sep_small).addClass('title').addClass('title_run').rotate(270);

  // save runs
  qlf_runs = {A1:A1,A2:A2,A3:A3,A4:A4,A5:A5,A6:A6,C1:C1,C2:C2,C3:C3,C4:C4,C5:C5,C6:C6,R1:R1,R2:R2,R3:R3,R4:R4,R5:R5,R6:R6}


  if (window.location.href.match(/#slideshow$/)) {
    slideshow = true;
    run_slideshow();
  }

  // run main loop that will fetch data and update the current page
  run_loop(0);

};
