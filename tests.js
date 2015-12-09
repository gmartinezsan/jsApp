/*
Unit test for Query module functionality
Framework used: qunitjs 
http://qunitjs.com/
*/


QUnit.test("CanSelectElement", function (assert) {
    var datasource = [
    { col1: 'red', col2: 'blue', col3: 'green', col4: 'purple'},
    { col1: 'brown', col2: 'white', col3: 'yellow', col4: 'blue'},
    { col1: 'pink', col2: 'black', col3: 'blue', col4: 'red'}
    ];
    var myQuery = new Query();
    myQuery.from(datasource);
    myQuery.select([function (row) { return 'Colors not red ' + row.col1 + ', ' + row.col2 + ', ' + row.col3 + ', ' + row.col4; }, 'concat']);    
    myQuery.where(function (row) { return row.col1 !== 'red' && row.col2 !== 'red' && row.col3 !== 'red' && row.col4 !== 'red'; });
    var result = myQuery.get();    
    assert.ok(result[0].concat === 'Colors not red brown, white, yellow, blue', "Passed")
});

QUnit.test("CanSelectElement2", function (assert) {
    var datasource = [
    { col1: 'red', col2: 'blue', col3: 'green', col4: 'purple' },
    { col1: 'brown', col2: 'white', col3: 'yellow', col4: 'blue' },
    { col1: 'pink', col2: 'black', col3: 'blue', col4: 'red' }
    ];
    var myQuery = new Query();
    myQuery.from(datasource);
    myQuery.select([function (row) { return 'Colors not red ' + row.col1 + ', ' + row.col2 + ', ' + row.col3 + ', ' + row.col4; }, 'concat']);    
    myQuery.where(function (row) { return row.col1 !== 'red'; });
    var result = myQuery.get();
    assert.ok(result.length == 2, "Passed");
});

QUnit.test("CanWhereBeNull", function (assert) {
    var datasource = [
    { col1: 'red', col2: 'blue', col3: 'green', col4: 'purple' },
    { col1: 'brown', col2: 'white', col3: 'yellow', col4: 'blue' },
    { col1: 'pink', col2: 'black', col3: 'blue', col4: 'red' }
    ];
    var myQuery = new Query();
    myQuery.from(datasource);
    myQuery.select([function (row) { return row.col1 + ', ' + row.col2 + ', ' + row.col3 + ', ' + row.col4; }, 'concat']);
    myQuery.where(null);
    var result = myQuery.get();
    assert.ok(result.length == 3, "Passed");
});

QUnit.test("CanThrowErrorWhenSelectFromIsMissing", function (assert) {
    var myQuery = new Query();
    assert.throws(
    function () {          
       myQuery.get();
    },
    "datasource or select are not set",
    "raised error instance matches the function error"
  );
});

QUnit.test("CanUseOrderby", function (assert) {
    var datasource = [
    { col1: 'red', col2: 'blue', col3: 'green', col4: 'purple' },
    { col1: 'brown', col2: 'white', col3: 'yellow', col4: 'blue' },
    { col1: 'pink', col2: 'black', col3: 'blue', col4: 'red' }
    ];
    var myQuery = new Query();
    myQuery.from(datasource);
    myQuery.select([function (row) { return row.col1 + ', ' + row.col2 ; }, 'colors']);
    //myQuery.where(function (row) { return row.col1 !== 'red'; });
    myQuery.orderby('colors');
    var result = myQuery.get();
    assert.ok(result.length == 3, "Passed");
    assert.ok(result[0].colors === 'brown, white', "Passed")
});