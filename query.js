/*
Query module that performs "SQL-like" operations on an array of objects
Usage:
//define the datasource
var datasource = [
    { col1: 'red', col2: 'blue', col3: 'green', col4: 'purple'},
    { col1: 'brown', col2: 'white', col3: 'yellow', col4: 'blue'},
    { col1: 'pink', col2: 'black', col3: 'blue', col4: 'red'}
    ];

// create Query object and set the properties
    var myQuery = new Query();
    myQuery.from(datasource);
    myQuery.select([function (row) { return 'Colors not red ' + row.col1 + ', ' + row.col2 + ', ' + row.col3 + ', ' + row.col4; }, 'concat']);    
    myQuery.where(function (row) { return row.col1 !== 'red' && row.col2 !== 'red' && row.col3 !== 'red' && row.col4 !== 'red'; });
    var result = myQuery.get(); 

// also can be used order by on one column
myQuery.orderby('concat');
*/

var Query = function () {
    var selectExpressions;
    var datasource;
    var where;
    var orderbyExpr;

    this.select = function () {
        selectExpressions = [].slice.call(arguments);        
    };

    this.orderby = function (orderbyColumn) {
        orderbyExpr = function compare(a, b) {            
            if (a[orderbyColumn] < b[orderbyColumn])
                return -1;
            if (a[orderbyColumn] > b[orderbyColumn])
                return 1;
            return 0;
        };
    }

    this.from = function (table) {
        datasource = table;
    };

    this.where = function (whereValue) {
        where = whereValue;                
    };

    this.get = function () {       
        var resultTable = [];

        if (datasource == null || selectExpressions == null) {
            throw "datasource or select are not set";
        }

        datasource.forEach(function(row)
        {            
           if (!where || where(row)) {                
               var resultRow = {};               
                selectExpressions.forEach(function(selectRow)
                {
                    var fnToApply = selectRow[0];                    
                    if (fnToApply(row) !== null) {
                        var column = selectRow[1];                        
                        resultRow[column] = fnToApply(row);                        
                    }
                }                                
                );                              
                resultTable.push(resultRow);
            }
        }
        );

        if (orderbyExpr) {
            resultTable.sort(orderbyExpr);
        }

        return resultTable;
    }
}