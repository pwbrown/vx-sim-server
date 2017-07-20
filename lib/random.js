var gen = require('random-seed');
var nonSeeded = gen.create();

const phoneNumbers = ["16823747762","14555411937","15526931491","16484417123","13567488197","17678218270","19284707594","14075344327","18855680030","12933907399","12761565732","16219461726","17748201038","17053141432","12148306262","16545805205","16067191241","15609250609","16391152848","13688614616","19785247315","13414890546","11984729317","12085761965","17313365881","18862833308","16495183329","14494815958","16019245888","16153039138","12559970062","19594273753","14762817921","12898440997","15796200029","15125743572","19393830151","18586295250","16486117432","16888765430","19168419706","16366987785","18599425016","16467329007","14701525173","16717729107","16394908559","17065426736","19276798549","16339406899","13954000203","11472029786","16471657479","18821927322","11059924931","12196895915","12323598422","17828409576","19877975191","13813345311","15962404087","13025663057","14745345107","11595423725","16037123758","17324895436","12023670050","13629836022","18886494210","11825184929","12472370720","11293066922","11597349256","17375793947","13383833238","13448141870","11358257022","17439426517","15835552258","15898288203","17065912146","15704185056","11387689239","11507384076","17182729605","18918141117","16325917729","16441562316","17441747045","18909946185","11768312747","12812046654","19358519164","19475966409","18546375567","19361916744","15908996561","12174712539","11204232819","19398587682"]
const cityStates = ["Orlando, Florida","St. Paul, Minnesota","Tulsa, Oklahoma","Madison, Wisconsin","Atlanta, Georgia","Jersey City, New Jersey","Tucson, Arizona","Modesto, California","Fort Worth, Texas","Dallas, Texas","Phoenix, Arizona","Charlotte, North Carolina","Reno, Nevada","Austin, Texas","Hialeah, Florida","Rochester, New York","Fort Wayne, Indiana","Boise, Idaho","Seattle, Washington","Santa Ana, California","Tampa, Florida","Plano, Texas","Scottsdale, Arizona","Philadelphia, Pennsylvania","Norfolk, Virginia","St. Petersburg, Florida","Columbus, Ohio","Arlington, Virginia","San Jose, California","Virginia Beach, Virginia","Anchorage, Alaska","Chandler, Arizona","Memphis, Tennessee","Lexington-Fayette, Kentucky","St. Louis, Missouri","Cleveland, Ohio","Garland, Texas","San Diego, California","Chesapeake, Virginia","Denver, Colorado","Corpus Christi, Texas","North Hempstead, New York","Jacksonville, Florida","Milwaukee, Wisconsin","Las Vegas, Nevada","Oakland, California","Nashville-Davidson, Tennessee","Wichita, Kansas","Birmingham, Alabama","New York, New York","San Bernardino, California","San Antonio, Texas","Miami, Florida","Bakersfield, California","Houston, Texas","Omaha, Nebraska","Baton Rouge, Louisiana","Washington, District of Columbia","Lincoln, Nebraska","Durham, North Carolina","Akron, Ohio","Greensboro, North Carolina","Fresno, California","Newark, New Jersey","Glendale, Arizona","Laredo, Texas","Honolulu, Hawaii","Stockton, California","Minneapolis, Minnesota","Long Beach, California","Riverside, California","Raleigh, North Carolina","Colorado Springs, Colorado","Buffalo, New York","Chula Vista, California","San Francisco, California","Baltimore, Maryland","Montgomery, Alabama","Boston, Massachusetts","New Orleans, Louisiana","Kansas City, Missouri","Chicago, Illinois","Los Angeles, California","Indianapolis, Indiana","Albuquerque, New Mexico","El Paso, Texas","Pittsburgh, Pennsylvania","Oklahoma City, Oklahoma","Portland, Oregon","Toledo, Ohio","Arlington, Texas","Henderson, Nevada","Cincinnati, Ohio","Lubbock, Texas","Aurora, Colorado","Sacramento, California","Anaheim, California","Mesa, Arizona","Detroit, Michigan","Huntington, New York"]
const boyNames = ["Ashton","Maddox","Semaj","Christian","Preston","Noah","Dwayne","Diego","Frederick","Nikhil","Kameron","Dean","Milton","Elijah","Karter","Nehemiah","Mario","Jaydon","Eduardo","Damian","Roland","Mekhi","Javier","Clayton","Dante","Marvin","Camden","Donte","Quintin","Madden","Aydan","Kendall","Moshe","Colton","Brock","Jax","Atticus","Jamarion","Alonso","Drake","Ronnie","Gunner","Reilly","Javion","Weston","Killian","Jonathon","Micheal","Devon","Cristopher","Emmanuel","Adonis","Izaiah","Dangelo","Elliott","Eric","Payton","Jamari","Ishaan","Sullivan","Josue","Jonas","Camron","Carlos","Raymond","Jasiah","Craig","Sincere","Koen","Dale","Trevor","Connor","Hugo","Callum","Charlie","Robert","Declan","Graham","Jorge","Anderson","Eden","Shaun","Toby","Kade","Fernando","Scott","Noel","Jason","Jakobe","Haiden","Titus","Leonard","Xander","Garrett","Zack","Kieran","Alvaro","Wayne","Nikolas","Will"]
const girlNames = ["Karli","Mikayla","Kaia","Beatrice","Angie","Tania","Reese","Rachel","Julia","Evangeline","Sandra","Ashlynn","Charlie","Natalie","Jasmin","Keira","Angelina","Shyann","Paisley","Alisson","Gabriella","Courtney","Ryan","Mckinley","Camila","Luna","Desirae","Monica","Kinsley","Amara","Nadia","Carina","Jenny","Miley","Mallory","Michelle","Adalynn","Jasmine","Dayami","Mia","Jazlene","Precious","Eleanor","Juliana","Emelia","Alivia","Kirsten","Aliya","Anaya","Serena","Carley","Keyla","Gracelyn","Denise","Kaylee","Clare","Liana","Maribel","Kiley","Kaleigh","Kaitlynn","Sara","Teagan","Roselyn","Anabelle","Yasmine","Jazmyn","Claire","Shirley","Cheyanne","Shayla","Sarahi","Alicia","Lily","Holly","Ingrid","Ansley","Denisse","Evie","Selena","Audrina","Monserrat","Rihanna","Melissa","Madyson","Kaya","Angela","Dahlia","Delaney","Casey","Rory","Marisol","Kelly","Ali","Kendra","Adelyn","Mary","Amya","Camille","Kadence"]
const lastNames = ["Mack","Keith","Stone","Nelson","Gonzalez","Morgan","Maynard","Ewing","Schultz","Sullivan","Tanner","Roman","Gomez","Scott","Cunningham","Rosario","Cabrera","Branch","Baxter","Church","Meza","Kirk","Stanley","Glover","Guerrero","Archer","Cooley","Acosta","Kennedy","Houston","Fleming","Lin","Drake","Byrd","Jacobs","Torres","Chaney","Rocha","Duke","Cobb","Reese","Duffy","Johns","Bates","Nolan","Swanson","Skinner","Hatfield","Ryan","Schaefer","Carey","Craig","Hayden","Norman","Huang","Chase","Middleton","Marks","Brandt","Randall","Juarez","Perry","Bishop","Espinoza","Cannon","Ruiz","Butler","Todd","Monroe","Grimes","Norton","Buckley","Mccall","Hill","Bautista","Nichols","Kim","Shields","Bell","Owen","Livingston","Chan","Beck","Burns","Lucas","Allison","Green","Daugherty","Kramer","Lozano","Snyder","Sandoval","Marshall","Mcclain","Kaiser","Fritz","West","Guzman","Miranda","Barron"]

function generateSeed(){
    return Math.random() * 10000;
}

exports.genIPAddress = function(){
    var ip = "";
    for(var i = 0; i < 4; i++){
        if(i !== 0) ip += ".";
        ip += nonSeeded(256);
    }
    return ip;
}

exports.genPhoneNumber = function(){
    var number = "";
    for(var i = 0; i < 10; i++){
        if(i == 3 || i == 6) number += "-";
        number += nonSeeded(10);
    }
    return number;
}

var createCaller = exports.createCaller = function(id){
    if(typeof id == 'undefined'){
        var id = generateSeed();
    }
    var seeded = gen.create(id);
    var number = phoneNumbers[seeded(100)];
    var cs = cityStates[seeded(100)];
    var gender = seeded(2);
    if(gender == 0) var firstName = boyNames[seeded(100)];
    else var firstName = girlNames[seeded(100)];
    var lastName = lastNames[seeded(100)]
    var cs = cs.split(",");
    var city = cs[0].trim();
    var state = cs[1].trim();
    var caller = {
        id: id,
        phone: number,
        gender: (gender == 1)? 'F' : 'M',
        firstName: firstName,
        lastName: lastName,
        city: city,
        state: state
    }
    return caller;
}