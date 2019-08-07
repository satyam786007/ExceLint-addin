"use strict";
exports.__esModule = true;
var binsearch_1 = require("./binsearch");
var colorize_1 = require("./colorize");
function fix(n) {
    return n.toString().padStart(10, '0');
}
function fix_array(arr) {
    return arr.map(function (x, _1, _2) { return fix(x); });
}
function fix_pair(p) {
    var p1 = p[0], p2 = p[1];
    return [fix_array(p1), fix_array(p2)];
}
function sort_x_coord(a, b) {
    var a1 = a[0], a2 = a[1];
    var b1 = b[0], b2 = b[1];
    if (a1[0] != b1[0]) {
        return (a1[0] - b1[0]);
    }
    else {
        return (a1[1] - b1[1]);
    }
}
function sort_y_coord(a, b) {
    var a1 = a[0], a2 = a[1];
    var b1 = b[0], b2 = b[1];
    if (a1[1] != b1[1]) {
        return (a1[1] - b1[1]);
    }
    else {
        return (a1[0] - b1[0]);
    }
}
function fix_grouped_formulas(g, newG) {
    //    console.log("newG = " + JSON.stringify(newG));
    //    newG = {};
    //    newGy = {};
    for (var _i = 0, _a = Object.keys(g); _i < _a.length; _i++) {
        var i = _a[_i];
        newG[i] = g[i].map(function (p, _1, _2) { return fix_pair(p); });
        //	newGy[i] = JSON.parse(JSON.stringify(newG[i])); // deep copy
        newG[i].sort(sort_x_coord);
        //	newGy[i].sort(sort_y_coord);
        if (true) {
            newG[i] = newG[i].map(function (x, _1, _2) {
                return [x[0].map(function (a, _1, _2) { return Number(a); }),
                    x[1].map(function (a, _1, _2) { return Number(a); })];
            });
        }
        //	newGy[i] = newGy[i].map((x,_,a) => { return [x[0].map((a,_1,_2) => Number(a)),
        //						     x[1].map((a,_1,_2) => Number(a))]; });
    }
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
//test_binsearch();
var comparisons = 0;
function numComparator(a_val, b_val) {
    //    console.log("a_val = " + JSON.stringify(a_val));
    var a = JSON.stringify(fix_array(a_val));
    var b = JSON.stringify(fix_array(b_val));
    comparisons++;
    //    console.log("Comparing " + JSON.stringify(a) + " to " + JSON.stringify(b));
    if (a === b) {
        return 0;
    }
    if (a < b) {
        return -1;
    }
    return 1;
}
function matching_rectangles(rect_ul, rect_lr, rect_uls, rect_lrs) {
    // Assumes uls and lrs are already sorted and the same length.
    var x1 = rect_ul[0];
    var y1 = rect_ul[1];
    var x2 = rect_lr[0];
    var y2 = rect_lr[1];
    // Try to find something adjacent to A = [[x1, y1, 0], [x2, y2, 0]]
    // options are:
    //   [x1-1, y2] left (lower-right)   [ ] [A] --> [ (?, y1) ... (x1-1, y2) ]
    //   [x2, y1-1] up (lower-right)     [ ]
    //                                   [A] --> [ (x1, ?) ... (x2, y1-1) ]
    //   [x2+1, y1] right (upper-left)   [A] [ ] --> [ (x2 + 1, y1) ... (?, y2) ]
    //   [x1, y2+1] down (upper-left)    [A]
    //                                   [ ] --> [ (x1, y2+1) ... (x2, ?) ]
    // left (lr) = ul_x, lr_y
    var left = [x1 - 1, y2, 0];
    // up (lr) = lr_x, ul_y
    var up = [x2, y1 - 1, 0];
    // right (ul) = lr_x, ul_y
    var right = [x2 + 1, y1, 0];
    // down (ul) = ul_x, lr_y
    var down = [x1, y2 + 1, 0];
    var matches = [];
    var ind = -1;
    ind = binsearch_1.binsearch(rect_lrs, left, numComparator);
    //	console.log("left = " + ind);
    if (ind != -1) {
        if (rect_uls[ind][1] === y1) {
            var candidate = [rect_uls[ind], rect_lrs[ind]];
            matches.push(candidate);
        }
    }
    ind = binsearch_1.binsearch(rect_lrs, up, numComparator);
    //	console.log("up = " + ind);
    if (ind != -1) {
        if (rect_uls[ind][0] === x1) {
            var candidate = [rect_uls[ind], rect_lrs[ind]];
            matches.push(candidate);
        }
    }
    ind = binsearch_1.binsearch(rect_uls, right, numComparator);
    //	console.log("right = " + ind);
    if (ind != -1) {
        if (rect_lrs[ind][1] === y2) {
            var candidate = [rect_uls[ind], rect_lrs[ind]];
            matches.push(candidate);
        }
    }
    ind = binsearch_1.binsearch(rect_uls, down, numComparator);
    //	console.log("down = " + ind);
    if (ind != -1) {
        if (rect_lrs[ind][0] === x2) {
            var candidate = [rect_uls[ind], rect_lrs[ind]];
            matches.push(candidate);
        }
    }
    return matches;
}
function find_all_matching_rectangles(thisKey, rect, grouped_formulas) {
    var base_ul = rect[0], base_lr = rect[1];
    //    console.log("Looking for matches of " + JSON.stringify(base_ul) + ", " + JSON.stringify(base_lr));
    var match_list = [];
    var a = grouped_formulas;
    var _loop_1 = function (key) {
        if (key === thisKey) {
            return "continue";
        }
        var x_ul = a[key].map(function (i, _1, _2) { var p1 = i[0], p2 = i[1]; return p1; });
        var x_lr = a[key].map(function (i, _1, _2) { var p1 = i[0], p2 = i[1]; return p2; });
        var matches = matching_rectangles(base_ul, base_lr, x_ul, x_lr);
        if (matches.length > 0) {
            //	    console.log("found matches for key "+key+" --> " + JSON.stringify(matches));
        }
        match_list = match_list.concat(matches.map(function (item, _1, _2) {
            var metric = colorize_1.Colorize.fix_metric(parseFloat(thisKey), rect, parseFloat(key), item);
            return [metric, rect, item];
        }));
    };
    for (var _i = 0, _a = Object.keys(a); _i < _a.length; _i++) {
        var key = _a[_i];
        _loop_1(key);
    }
    //	console.log("match_list = " + JSON.stringify(match_list));
    return match_list;
}
function dedup(arr) {
    var t = {};
    return arr.filter(function (e) { return !(t[e] = e in t); });
}
function find_all_proposed_fixes(grouped_formulas) {
    var all_matches = [];
    for (var _i = 0, _a = Object.keys(grouped_formulas); _i < _a.length; _i++) {
        var key = _a[_i];
        var a = {};
        fix_grouped_formulas(grouped_formulas, a); // , b);
        for (var i = 0; i < a[key].length; i++) {
            var matches = find_all_matching_rectangles(key, a[key][i], a);
            all_matches = all_matches.concat(matches);
        }
    }
    if (false) {
        all_matches = all_matches.map(function (x, _1, _2) {
            return [x[0].map(function (a, _1, _2) { return Number(a); }),
                x[1].map(function (a, _1, _2) { return Number(a); })];
        });
    }
    //    console.log("before: " + JSON.stringify(all_matches));
    all_matches = all_matches.map(function (x, _1, _2) {
        if (numComparator(x[1], x[2]) < 0) {
            return [x[0], x[2], x[1]];
        }
        else {
            return [x[0], x[1], x[2]];
        }
    });
    all_matches = dedup(all_matches);
    //   console.log("after: " + JSON.stringify(all_matches));
    return all_matches;
}
exports.find_all_proposed_fixes = find_all_proposed_fixes;
function test_find_all_proposed_fixes(grouped_formulas) {
    comparisons = 0;
    var all_fixes = find_all_proposed_fixes(grouped_formulas);
    console.log("all matches = " + JSON.stringify(all_fixes));
    console.log("comparisons = " + comparisons);
    var theLength = 0;
    for (var _i = 0, _a = Object.keys(grouped_formulas); _i < _a.length; _i++) {
        var k = _a[_i];
        theLength += grouped_formulas[k].length;
    }
    console.log("total length of grouped_formulas = " + theLength);
}
exports.test_find_all_proposed_fixes = test_find_all_proposed_fixes;
//let r = require('./grouped_formulas.js');
//test_find_all_proposed_fixes(r.grouped_formulas);
