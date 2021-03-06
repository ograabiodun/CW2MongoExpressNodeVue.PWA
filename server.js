const express = require("express");
const session = require("client-sessions");
const PORT = 1234;
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

// Retrieve
var db
var p
var MongoClient = require('mongodb').MongoClient; 
MongoClient.connect('mongodb+srv://user:password1234@cluster0-pjbde.mongodb.net/test?retryWrites=true&w=majority', function(err, db) {
  if(!err) {
  p = db
    console.log("Connection successful");
}
  else
  {
  db = client.db('MuDB')
  }
});


//get Login
app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 100,
    activeDuration: 5 * 60 * 1000,
  })
  );

//login page/ default page
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/pages/login.html');
  
  });

  //log in as users or Admin
app.get("/showallrecord", (req, res) => {

    const dbo = p.db("MuDB");
    
    dbo.collection('courses').find().toArray(function(err, results) {
     
    if(results)
      {
    
      console.log(results.toArray)
    
    // to see the first element
      res.send(results)
    
      }
    
    else
     console.log(err)
    
      // send HTML file populated with quotes here
    })
    
    });

    //adminBoard page
app.get("/search", (req, res) => {
    res.sendFile(__dirname + '/pages/adminBoard.html');
  
  });

  //userBoard page
app.get("/pages/userBoard", (req, res) => {
    res.sendFile(__dirname + '/pages/userBoard.html');
  
  });

  //courses search 
app.get("/allcourses", (req, res) => {

    const dbo = p.db("MuDB");
    
    dbo.collection('courses').find().toArray(function(err, results) {
     
    if(results)
      {
    
      console.log(results.toArray)
    
    // to see the first element
      res.json(results)
    
      }
    
    else
     console.log(err)
    
      // send HTML file populated with quotes here
    })
    
    });

    //show all comments 
app.get("/allcomments", (req, res) => {

    const dbo = p.db("MuDB");
    
    dbo.collection('comments').find().toArray(function(err, results) {
     
    if(results)
      {
    
      console.log(results.toArray)
    
    // to see the first element
      res.json(results)
    
      }
    
    else
     console.log(err)
    
      // send HTML file populated with quotes here
    })
    
    });

    ////user and Admin register 1
app.post('/form_decision', (req, res) => {
    console.log('usertype:', req.body['usertype']);
    console.log('Got Name:', req.body['name']);
  
  var u_name = req.body['name'];
  var u_pass = req.body['password'];
  var u_email = req.body['email'];
  var u_usertype = req.body['usertype'];
  
  //mongo connection for the registeration
  const dbo1 = p.db("MuDB");
  
  dbo1.collection('userdetails').save({name: u_name, email:u_email ,password:u_pass, usertype:u_usertype}, (err, result) => {
     if (err) return console.log(err)
  
     console.log('saved to database')
     res.redirect('/user')
  
   })
  
  //user and Admin register 2
  if(u_usertype =='user')
    res.redirect('/pages/userBoard');
  
  else if (u_usertype=='provider')
    res.redirect('/pages/adminBoard');
  });

/* GET JSON */

app.get('/json', function(req, res) {

    var at = JSON.stringify({0: req.session.user, 1:req.session.user}
      )
  
    res.json({"foo": "bar"});
  
  });

  /* GET HTML FILE */
app.get('/pages/register', function(req, res) {

    res.sendFile(__dirname + '/pages/register.html') //create a index file 
  
  });

  /* GET HTML FILE */
app.get('/pages/userBoard', function(req, res) {

    res.sendFile(__dirname + '/pages/userBoard.html') //create a index file 
    
    //res.send("User Page");   
    });

    app.post('/pages/userBoard', (req, res) => {
        console.log('Got Name:', req.body['name']);
        console.log('Got ID:', req.body['email']);
      
      var u_name = req.body['name'];
      var u_pass = req.body['password'];
      var u_email = req.body['email'];
      
      
      console.log(u_name);
      
      const dbo = p.db("MuDB");
        
      var query = { email: u_email };
      
        dbo.collection('userdetails').find(query).toArray(function(err, results) {
         
      
      
      
        if(results.length != 0) //User exists
          {
          
        // to see the first element
          // res.send('user found' +JSON.stringify(results))
        
      
      
          req.session.user = results[0].name;   // Saving User details in Sessions to show name across all pages
      
      
          console.log('user found ' + results[0].name);
            //redirect
      
                //redirect - admin and normal user
              if (results[0].adminuser == true)
                  res.redirect('/pages/adminBoard')
              else if (results[0].adminuser == false)
                  res.redirect('/pages/userBoard.html')
      
      
          }
          else if (results.length == 0)
          { 
            
            console.log('This user does not exist'); 
      
        }
        else
         console.log(err)
        
          // send HTML file populated with quotes here
        })
      
      
      
      //res.sendStatus(200);
      });

      app.post('/pages/userBoard', (req, res) => {
        console.log('Got ID:', req.body['_id']);
        console.log('Got Name:', req.body['name']);
    
    var u_name = req.body['name'];
    var u_pass = req.body['password'];
    var u_email = req.body['email'];
    
    
    const dbo1 = p.db("MuDB");
    
    dbo1.collection('userdetails').save({Name: u_name, Email:u_email ,Password:u_pass}, (err, result) => {
       if (err) return console.log(err)
    
       console.log('saved to database')
       res.redirect('/pages/userBoard')
    
     })
        //res.sendStatus(200);
    });

     //Postscomments
app.post('/addComments', (req, res) => {

    var u_topic = req.body['topic'];
    var u_comment = req.body['comment'];
    var u_rating = req.body['rating'];
  
  
  const dbo1 = p.db("MuDB");
  
    dbo1.collection('comments').save({topic: u_topic, comment:u_comment ,rating:u_rating}, (err, result) => {
      if(err) return console.log(err)
      console.log('Courses commented')
  
      res.redirect('/pages/userBoard');
    })
   });

   /* UPDATE course */

app.post('/update', (req, res) => {

    const dbo2 = p.db("MuDB"); //database
    
    var u_topic = req.body['topic'];
    var u_location = req.body['location'];
    var u_price = req.body['price'];
    
      var myquery = { courses: u_topic }; //record you want to search
      var newvalues = { $set: {topic:u_topic, location:u_location,  pirce:u_price } };
    
    
      // collection
      dbo2.collection("courses").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
       });
    
    });

    /* DELETE RECORD */

app.post('/delete', (req, res) => {

    const dbo2 = p.db("MuDB");
    
    var u_topic = req.body['topic'];
    
      var myquery = { courses: u_topic };
      var newvalues = { $set: {courses: u_topic} };
    
      dbo2.collection("courses").deleteOne(myquery, function(err, res) {
        if (err) throw err;
        console.log("1 course deleted");
       });
    
    });

    /* Add course */
  
  app.post('/add', (req, res) => {
    console.log('topic:', req.body['topic']);
    console.log('Amount:', req.body['price']);
  
  var u_topic = req.body['topic'];
  var u_location = req.body['location'];
  var u_price = req.body['price'];
  
  //mongo connection for the registeration
  const dbo1 = p.db("MuDB");
  
  dbo1.collection('courses').save({topic: u_topic, location:u_location ,price:u_price}, (err, result) => {
     if (err) return console.log(err)
  
     console.log('1 course saved to database')
  });
  
  });



// SHOW LOG THAT NODE SERVER STARTED
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
   });