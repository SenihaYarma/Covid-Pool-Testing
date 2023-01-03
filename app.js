const express = require("express");
const app = express();
const url = require('url');

var MongoClient = require('mongodb').MongoClient;
var mongodb = require("mongodb");
var ObjectID = require('mongodb').ObjectID;
var urll = "mongodb+srv://seniha:seniha@cluster0.ovdtj.mongodb.net/<dbname>?retryWrites=true&w=majority";

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server started!");
});


app.get("/labLogin", (req, res) => {
    MongoClient.connect(urll, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Final");
        res.writeHead(200, { "Content-Type": "text/html" });
        let query = url.parse(req.url, true).query;

        let labId = query.labId ? query.labId : "";
        let password = query.password ? query.password: "";  

        let html = '<!DOCTYPE html><html lang="en"><head><title> Lab Login Page </title></head><body><h1> Lab Login Page </h1><br><form id="form1" method="get" action ="/labLogin/labHome"><b>Lab ID:</b><input type="text" name="labId" value=""></input><br><b>Password:</b><input type="text" name="password" value=""></input><br><button onclick="validate(labId, password)" type="submit" form="form1" value="Submit">Log In</button></form></body></html>';
        dbo.collection("LabEmployee").find({labID: labId, password: password}).toArray(function(err, result) {
            if(err) throw err;
            if(labId != ""){
                console.log(result[0]);
                if(result[0] != undefined){
            if(result[0].labID == labId){
                console.log("in");
                // app.get("/labLogin/check", (res) => {
                //     res.redirect('/labLogin/labHome');
                // });
                 html = html.replace('action ="/labLogin"', 'action ="/labLogin/labHome"');
            }}}
            res.write(html);
            res.end();
            db.close();
        });
    });
});

app.get("/labLogin/check", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    MongoClient.connect(urll, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Final");
        let query = url.parse(req.url, true).query;

        let labId = query.labId ? query.labId : "";
        let password = query.password ? query.password: "";  
        console.log(labId);
        let html = '<!DOCTYPE html> <html lang="en"> <head></head><body><form method="get" action ="/labLogin"><b>Either ID or password is incorrect! Click the button to return the Lab Login Page </b><input type="submit" values="Go Back"><br></form><br><br></body></html>';
        dbo.collection("LabEmployee").find({labID: labId, password: password}).toArray(function(err, result) {
            if(err) throw err;
            if(result[0].labID == labId){ 
                res.redirect('/labLogin/labHome');}
        });
        res.write(html);
        res.end();
    });
});


app.get("/labLogin/labHome", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    let homeHtml = '<!DOCTYPE html><html lang="en"><head><title> Lab Home </title></head><body><h1 style="text-align:center"> Lab Home </h1><br><form action="/labLogin/labHome/testCollection" method="get" style="text-align:center"><button> Test Collection </button></form><br><form action="/labLogin/labHome/poolMapping" method="get" style="text-align:center"><button> Pool Mapping </button></form><br><form action="/labLogin/labHome/wellTesting" method="get" style="text-align:center"><button> Well Testing </button></form><br></body></html>';
    let query = url.parse(req.url, true).query;

    let labId = query.labId ? query.labId : "";
    let password = query.password ? query.password: "";  
    res.write(homeHtml);
    res.end();
}); 

app.get("/labLogin/labHome/testCollection", (req, res) => {
    MongoClient.connect(urll, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Final");
        res.writeHead(200, { "Content-Type": "text/html" });
        let query = url.parse(req.url, true).query;
        
        let labId = query.labId ? query.labId : "";
        let empId = query.empId ? query.empId : "";
        let barcode = query.barcode ? query.barcode: ""; 
        let del = query.del ? query.del: ""; 

        let html = '<!DOCTYPE html><html lang="en"><head> <title> Lab Login Page </title><style type = text/css> table, tr, th, td { border: 1px solid black;height: 20px;vertical-align: bottom;padding: 5px;text-align: left;}</style></head><body><h1> Lab Login Page </h1><br><form method="get" action ="/labLogin/labHome/testCollection"><b>Employee ID:</b><input type="text" name="empId" value=""></input><br><b>Test Barcode:</b><input type="text" name="barcode" value=""></input><input type="submit" values="Add"><br></form><br><br>  <form action="/labLogin/labHome/testCollection" method="get">  <table><tr><th> Emp ID </th><th> Test Barcode </th></tr><tr><td> <input type=checkbox> Emp ID </td><td> Test Barcode </td></tr></table><input type="submit" value="Delete"></form></body></html>';
        dbo.collection("EmployeeTest").insertOne({testBarcode: barcode,employeeID: empId, collectionTime: '12/12/2020', collectedBy: labId}, function(err) {
        if(err) throw err;
        if(del != ""){
            dbo.collection("EmployeeTest").deleteOne({_id: new mongodb.ObjectID(del)},function(err) {if(err) throw err;});
        }
        dbo.collection("EmployeeTest").deleteOne({testBarcode: del},function(err) {if(err) throw err;});

        dbo.collection("EmployeeTest").find({testBarcode: { $gte: " " }}).toArray(function(err, result) {
                if (err) throw err;
                html = html.replace('<tr><td> <input type=checkbox> Emp ID </td><td> Test Barcode </td></tr>', getTest(result));
                
                res.write(html);
                res.end();
            db.close();
        });
        });
    });
});

app.get("/labLogin/labHome/poolMapping", (req, res) => {
    MongoClient.connect(urll, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Final");
        res.writeHead(200, { "Content-Type": "text/html" });
        let query = url.parse(req.url, true).query;
        
        let poolBar = query.poolBar ? query.poolBar: "";
        let barcode1 = query.barcode ? query.barcode: "";  
        let del = query.del ? query.del: "";
        console.log(del);

        let html = '<!DOCTYPE html> <html lang="en"> <head> <title> Pool Mapping </title><style type = text/css> table, tr, th, td { border: 1px solid black;height: 15px;vertical-align: bottom;padding: 5px;text-align: left;}fieldset {background-color: #eeeeee;width: 250px;text-align: center;margin-left: 100px;}input {margin: 3px;}</style></head><body><h1> Pool Mapping </h1><br><form method="get" action ="/labLogin/labHome/poolMapping"><b>Pool Barcode:</b><input type="text" name="poolBar" value=""></input><br><b>Test Barcodes:</b><fieldset style="padding: 15px;"><input id="1" type="text" name="barcode" value="" multiple></input><input id="2" type="button" onclick="myFunction()" value="Delete"></input><br><input id="row" type="button" onclick="addFunction()" value="Add More Rows"></input></fieldset><input type="submit" value="Submit Pool" style="margin-left: 75px;"><br></form><br><br><form action="/labLogin/labHome/poolMapping" method="get"><table><tr><th> Pool Barcode </th><th> Test Barcode </th></tr><tr><td><input type="checkbox" name="del"> Pool Barcode </td><td> Test Barcode </td></tr></table><input type="submit" value="Delete"></form><script>function myFunction(){document.getElementById("2").previousElementSibling.remove();document.getElementById("2").remove();}function addFunction(){var h = document.getElementById("row").previousElementSibling;var code = "<input id='+"'1'"+'type='+"'text'"+'name='+"'barcode'"+' value='+"''"+'></input><input id='+"'2'"+' type='+"'button'"+' onclick='+"'myFunction()'"+' value='+"'Delete'"+'></input>";h.insertAdjacentHTML("afterend", code);}</script></body></html>';
        dbo.collection("Pool").insertOne({poolBarcode: poolBar}, function(err) {
        if(err) throw err;
            dbo.collection("PoolMap").insertOne({poolBarcode: poolBar,testBarcode: barcode1}, function(err) {
            if(err) throw err;
            if(del != ""){
            dbo.collection("PoolMap").deleteOne({_id: new mongodb.ObjectID(del)},function(err) {
                if(err) throw err;});}
            dbo.collection("PoolMap").deleteMany({poolBarcode: ""}, function(err) {if(err) throw err;});
        dbo.collection("PoolMap").find({poolBarcode: { $gte: " " }}).toArray(function(err, result) {
                if (err) throw err;
                html = html.replace('<tr><td><input type="checkbox" name="del"> Pool Barcode </td><td> Test Barcode </td></tr>', getPool(result));
                //console.log(html);
                res.write(html);
                res.end();
            db.close();
            });
    });
    });
    });
});

app.get("/labLogin/labHome/wellTesting", (req, res) => {
    MongoClient.connect(urll, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Final");
        res.writeHead(200, { "Content-Type": "text/html" });
        let query = url.parse(req.url, true).query;
        
        let wellBar = query.wellBar ? query.wellBar: "";
        let poolBar = query.poolBar ? query.poolBar: "";  
        let result = query.result ? query.result: "";
        let del = query.del ? query.del: "";
        let as = query.as ? query.as: "";

        let html = '<!DOCTYPE html> <html lang="en"> <head> <title> Well Testing </title><style type = text/css> table, tr, th, td { border: 1px solid black;height: 15px;vertical-align: bottom;padding: 5px;text-align: left;}</style></head><body><h1> Well Testing </h1><br><form method="get" action ="/labLogin/labHome/wellTesting"><b>Well Barcode:</b><input type="text" name="wellBar" value=""></input><br><b>Pool Barcode:</b><input type="text" name="poolBar" value=""></input><br><b>Result:</b><select name="result"><option value="inProgress">in progress</option><option value="neg">negative</option><option value="pos">positive</option></select><input type="submit" values="Add"><br></form><br><br><form method="get" action ="/labLogin/labHome/wellTesting"><table><tr><th> Well Barcode </th><th> Pool Barcode </th><th> Result </th></tr><tr><td> <input type="checkbox"> Well Barcode </td><td> Pool Barcode </td><td> Result </td></tr></table><br><input type="submit" value="Edit" name="as"><input type="submit" value="Delete" name="as"></form></body></html>';
        dbo.collection("Well").insertOne({wellBarcode: wellBar}, function(err) {
        if(err) throw err;
            dbo.collection("WellTesting").insertOne({poolBarcode: poolBar,wellBarcode: wellBar, testingStartTime: "12/12/2020", testingEndTime: "", result: result}, function(err) {
            if(err) throw err;
            if(del != "" && as == "Delete"){
            dbo.collection("WellTesting").deleteOne({_id: new mongodb.ObjectID(del)},function(err) {
                if(err) throw err;});}
            if(del != "" && as == "Edit"){
                dbo.collection("WellTesting").findOne({_id: new mongodb.ObjectID(del)},function(err, result) {if(err) throw err;
                html = html.replace('<input type="text" name="wellBar" value=""></input><br><b>Pool Barcode:</b><input type="text" name="poolBar" value=""></input><br><b>Result:</b><select name="result"><option value="inProgress">in progress</option><option value="neg">negative</option><option value="pos">positive</option></select>', editWell(result));
            });
            dbo.collection("WellTesting").deleteOne({_id: new mongodb.ObjectID(del)},function(err) {if(err) throw err;});
            }    
            dbo.collection("WellTesting").deleteMany({poolBarcode: ""}, function(err) {if(err) throw err;});
        dbo.collection("WellTesting").find({poolBarcode: { $gte: " " }}).toArray(function(err, result) {
                if (err) throw err;
                html = html.replace('<tr><td> <input type="checkbox"> Well Barcode </td><td> Pool Barcode </td><td> Result </td></tr>', getWell(result));
                res.write(html);
                res.end();
            db.close();
            });
    });
    });
    });
});


app.get("/empLogin", (req, res) => {
    MongoClient.connect(urll, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Final");
        res.writeHead(200, { "Content-Type": "text/html" });
        let query = url.parse(req.url, true).query;

        let email = query.email ? query.email : "";
        let password = query.password ? query.password: "";  

        let html = '<!DOCTYPE html> <html lang="en"> <head> <title> Employee Login Page </title></head><body><h1> Employee Login Page </h1><br><form method="get" action ="/empLogin/empHome"><b>Email:</b><input type="text" name="email" value=""></input><br><b>Password:</b><input type="text" name="password" value=""></input><input type="submit" value="Submit"><br></form></body></html>';
        res.write(html);
        res.end();
        // dbo.collection("Employee").find({email: email, passcode: password}).toArray(function(err, result) {
        //     //res.write(html);
        //     // res.end();
        //     // db.close();
        //     console.log(result);
        // });
        db.close();
    });
});

app.get("/empLogin/empHome", (req, res) => {
    MongoClient.connect(urll, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Final");
        res.writeHead(200, { "Content-Type": "text/html" });
        let query = url.parse(req.url, true).query;

        let email = query.email ? query.email : "";
        let password = query.password ? query.password: "";  

        let html = '<!DOCTYPE html> <html lang="en"><head> <title> Lab Login Page </title><style type = text/css> table, tr, th, td { border: 1px solid black;height: 20px;vertical-align: bottom;padding: 5px;text-align: center;}</style></head><body><h1> Employee Home </h1><br><table><tr><th> Collection Date</th><th> Result </th></tr><tr><td>  Collection Date </td><td> Result </td></tr></table></body></html>';
        dbo.collection("Employee").find({email: email, passcode: password}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            let id = result[0].employeeID;

        //console.log(id);
        dbo.collection("EmployeeTest").find({employeeID: id}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            for(let item of result){
                //var date = item.collectionTime;
                //console.log(item + " " + date);
                dbo.collection("PoolMap").find({testBarcode: item.testBarcode}).toArray(function(err, result2) {
                    if (err) throw err;
                    //console.log(result2);
                    for(let item2 of result2){
                    dbo.collection("WellTesting").find({poolBarcode: item2.poolBarcode}).toArray(function(err, result3) {
                        if (err) throw err;
                        console.log(result3);
                        html = html.replace('<tr><td>  Collection Date </td><td> Result </td></tr>', getEmpTest(result3));
                        //console.log(html);
                        res.write(html);
                        res.end();
                    });
                    }
                });
            }
        });
    });
    });
});

function getEmpTest(SQLResult) {
    let retStr = "";
    for (let item of SQLResult) {
        if(item != []){
            //console.log(item.testingStartTime + " " + item.result);
            retStr += "<tr><td>" + item.testingStartTime + "</td><td>" + item.result + "</td></tr>";
        }
    }
    console.log(retStr);
    return retStr;
}

function getTest(SQLResult) {
    let retStr = "";
    for (let item of SQLResult) {
        retStr += "<tr><td> <input type='checkbox' name='del' value=" + item._id + ">" + item.employeeID + "</td><td>" + item.testBarcode + "</td></tr>";
    }
    return retStr;
}


function getPool(SQLResult) {
    let retStr = "";
    for (let item of SQLResult) {
        retStr += "<tr><td> <input type='checkbox' name='del' value=" + item._id + ">" + item.poolBarcode + "</td><td>" + item.testBarcode + "</td></tr>";
    }
    return retStr;
}

function getWell(SQLResult) {
    let retStr = "";
    for (let item of SQLResult) {
        retStr += "<tr><td> <input type='checkbox' name='del' value=" + item._id + ">" + item.wellBarcode + "</td><td>" + item.poolBarcode + "</td><td>" + item.result + "</td></tr>";
    }
    return retStr;
}

function editWell(item) {
    let retStr = "";
    if (item.result == "inProgress") {
        '<input type="text" name="wellBar" value='+item.wellBarcode+'></input><br><b>Pool Barcode:</b><input type="text" name="poolBar" value='+item.poolBarcode+'></input><br><b>Result:</b><select name="result"><option value="inProgress">in progress</option><option value="neg" selected>negative</option><option value="pos">positive</option></select>';

        retStr += '<input type="text" name="wellBar" value='+item.wellBarcode+'></input><br><b>Pool Barcode:</b><input type="text" name="poolBar" value='+item.poolBarcode+'></input><br><b>Result:</b><select name="result"><option value="inProgress">in progress</option><option value="neg">negative</option><option value="pos">positive</option></select>';

    }
    if (item.result == "pos") {
        retStr += '<input type="text" name="wellBar" value='+item.wellBarcode+'></input><br><b>Pool Barcode:</b><input type="text" name="poolBar" value='+item.poolBarcode+'></input><br><b>Result:</b><select name="result"><option value="inProgress">in progress</option><option value="neg">negative</option><option value="pos" selected>positive</option></select>';

    }
    if (item.result == "neg") {
        retStr += '<input type="text" name="wellBar" value='+item.wellBarcode+'></input><br><b>Pool Barcode:</b><input type="text" name="poolBar" value='+item.poolBarcode+'></input><br><b>Result:</b><select name="result"><option value="inProgress">in progress</option><option value="neg" selected>negative</option><option value="pos">positive</option></select>';
    }
    return retStr;
}