function categoryupdatefor_ML() {
 var conn =db_GetConnection();
    var stmt = conn.createStatement();
  var etticket=[];
  var description=[];
  var date = new Date()
  var resultdate = new Date(date.getTime()-1*(24*3600*1000));
var createdateml=Utilities.formatDate(resultdate, _timeZone, "yyyy-MM-dd");
var todaydateml=Utilities.formatDate(date, _timeZone, "yyyy-MM-dd");

var mlcategory=[];
    var IP_location_query="select * from requestmaster where requestdate in ( '"+createdateml+"' , '"+todaydateml+"' ) and  mlcategory is null  "
    
 var IP_location_rs=stmt.executeQuery(IP_location_query);
        while(IP_location_rs.next())
    {
    etticket.push(IP_location_rs.getString("id"));
    description.push(IP_location_rs.getString("description"));
        mlcategory.push(IP_location_rs.getString("mlcategory"));
    }  
IP_location_rs.close();


      for (var i = 0; i < etticket.length; i++) {
      
      Logger.log(description[i])
      if(description[i]!= '' && description[i]!= null)
      {
      
      if(description[i]!='' && description[i]!=null)
      {
      var getcatml = mlcat_retrievemldata_hd(description[i])
      var mlsenti = mlsentiment_retrievemldata_hd(description[i])
      }
Logger.log(mlsenti)
  Logger.log(getcatml)
if(getcatml!=null && mlsenti!=null)
{
   var Updatetheinformation="update  requestmaster set mlcategory =  '"+getcatml.prediction+"',  mlsentiment = '"+mlsenti.prediction+"'  where id = '"+etticket[i]+"'";
//Logger.log(Updatetheinformation)
stmt.executeUpdate(Updatetheinformation);
}
}
}
stmt.close();
conn.close();
}



function mlcat_retrievemldata_hd(description) {
  
  
  const nlOptions = {
    method : 'post',
    contentType: 'application/json',  
    payload : JSON.stringify({"query":description})
  };
  
  var endpoint="https://cf/hd_categoryfinder"
  
  try {
    
    const response = UrlFetchApp.fetch(endpoint, nlOptions);
    return JSON.parse(response);
    
  } catch(e) {
    
    // log the error message and return null if not successful
    console.log("Error fetching the Category fetching API: " + e);
    return null;
  } 
}


function mlsentiment_retrievemldata_hd(description) {
  
  
  
  const nlOptions = {
    method : 'post',
    contentType: 'application/json',  
    payload : JSON.stringify({"query":description})
  };
  
  var endpoint="https://cf/sentimentanalysis"
  
  try {
    
    const response = UrlFetchApp.fetch(endpoint, nlOptions);
    return JSON.parse(response);
    
  } catch(e) {
    
    // log the error message and return null if not successful
    console.log("Error fetching the sentiment fetching API: " + e);
    return null;
  } 
}




