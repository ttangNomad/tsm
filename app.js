const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('express-flash')
const session = require('express-session')
const cors = require('cors');

const port = 3000;

app.set('view engine', 'html');

app.set('views', path.join(__dirname, "views"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/script'));
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(cors({origin: 'http://192.168.1.52:3000'}))


app.use(session({
    cookie: {
        maxAge: 60000
    },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(flash());

let indexRouter = require('./routes/index');
// path master setting module
let partMasterRouter = require('./routes/bom_master_setting/part_master');
let moldMasterRouter = require('./routes/bom_master_setting/mold_master');
let machineMasterRouter = require('./routes/bom_master_setting/machine_master');
let inkMasterRouter = require('./routes/bom_master_setting/ink_master');
let colorMasterRouter = require('./routes/bom_master_setting/color_master');
let thinnerMasterRouter = require('./routes/bom_master_setting/thinner_master');
let HardenerMasterRouter = require('./routes/bom_master_setting/hardener_master');
let injectionMatMasterRouter = require('./routes/bom_master_setting/injection_material_master');
let hotStampMasterRouter = require('./routes/bom_master_setting/hot_stamp_master');
let customerRouter = require('./routes/bom_master_setting/customer_master');

//path main module
let referenceNoRouter = require('./routes/bom_main/reference_number');
let summaryRouter = require('./routes/bom_main/summary');
let injectionRouter = require('./routes/bom_main/injection');
let hotStampRouter = require('./routes/bom_main/hot_stamp');
let assemblyRouter = require('./routes/bom_main/assembly');
let sprayRouter = require('./routes/bom_main/spray');
let printingRouter = require('./routes/bom_main/printing');
let weldingRouter = require('./routes/bom_main/welding');
let packingRouter = require('./routes/bom_main/packing');
let dropDownRouter = require('./routes/bom_main/dropdown');
let usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/part_master', partMasterRouter);
app.use('/mold_master', moldMasterRouter);
app.use('/machine_master', machineMasterRouter);
app.use('/ink_master', inkMasterRouter);
app.use('/color_master', colorMasterRouter);
app.use('/thinner_master', thinnerMasterRouter);
app.use('/hardener_master', HardenerMasterRouter);
app.use('/injection_material_master', injectionMatMasterRouter);
app.use('/hot_stamp_material_master', hotStampMasterRouter);
app.use('/customer_master', customerRouter);


app.use('/reference_no', referenceNoRouter);
app.use('/summary', summaryRouter);
app.use('/injection', injectionRouter);
app.use('/hot_stamp', hotStampRouter);
app.use('/assembly', assemblyRouter);
app.use('/spray', sprayRouter);
app.use('/printing', printingRouter);
app.use('/welding', weldingRouter);
app.use('/packing', packingRouter);
app.use('/dropdown', dropDownRouter);
app.use('/users', usersRouter);

let uploadImageRouter = require('./routes/bom_main/uploadImage');
app.use('/image', uploadImageRouter);

let dropdownPlanRouter = require('./routes/injection_planning/dropdown');
app.use('/plan/dropdown', dropdownPlanRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})
module.exports = app;
