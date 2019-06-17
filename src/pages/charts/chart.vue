<template>
    <div id="home">
        <el-card class="box-card" id="chart" style="margin-top: 60px;margin-bottom: 30px">
            <div class="block" style="margin-bottom: 5px">
                <!--<el-select id="scoreNameSelect" v-model="scoreNames[backgroundColor1]" placeholder="请选择">-->
                <!--<el-option-->
                <!--v-for="(item,index) in scoreNames"-->
                <!--:key="item"-->
                <!--:label="item"-->
                <!--:value="item">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--scoreName-->
                <div style="margin-bottom: 10px;white-space: nowrap">
                    <el-button-group style="margin-left: 2%;white-space: nowrap;">
                        <el-button v-for="(item1,index1) in scoreNames" type="primary"
                            :key="index1"
                            @click="changeScoreName(item1,index1)"
                            :class="{active1:backgroundColor1 == index1}"
                            style="padding: 12px 10px">
                            {{item1}}
                        </el-button>
                    </el-button-group>
                </div>

                <!--date-->
                <div style="display: inline-block">
                    <el-date-picker v-model="thisDay" type="date" placeholder="选择日期时间" align="right"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                        @change="changeDate" style="margin: 10px 20px">
                    </el-date-picker>
                </div>

                <!--newORold-->
                <el-button-group style="margin-left: 2%;white-space: nowrap;">
                    <el-button v-for="(item2,index2) in oldNew" type="success"
                        :key="index2"
                        @click="newOrOld(item2,index2)"
                        :class="{active2:backgroundColor2 == index2}"
                        style="padding: 12px 10px">
                        {{item2}}
                    </el-button>
                </el-button-group>

                <!--productName-->
                <el-form ref="form" label-width="60px"
                    style="display: inline-block;line-height:40px;margin:10px 1% 0px 2%;">
                    <el-form-item label="产品：">
                        <el-select multiple v-model="productName" @input="productNameCheck"
                            style="">
                            <el-option v-for="(item,index) in productNames" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

                <!--channelId-->
                <el-form ref="form" label-width="60px"
                    style="display: inline-block;line-height:40px;margin:10px 1% 0px
                2%;">
                    <el-form-item label="渠道：">
                        <el-select multiple v-model="channelId" @input="channelIdCheck">
                            <el-option v-for="item in channelIds" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <!--subSection-->
            <div class="demo-input-suffix"
                style="color: #a8a8a8;display: inline-block;width: 280px;margin: 5px 10px 5px">
                分数区间：
                <el-tooltip content="(区间前闭后开[100): 0 <= x < 100,100 <= x < 200...)" placement="bottom-end"
                    effect="light">
                    <el-input placeholder="分数区间" v-model="subSection" style="width: 100px"
                        :disabled="!sectionIpt"
                        @blur="sectionCheck()" @keyup.enter.native="thisInputBlur($event)">
                    </el-input>
                </el-tooltip>
            </div>

            <!--maxScore-->
            <div class="demo-input-suffix"
                style="color: #a8a8a8;display: inline-block;width: 280px;margin: 5px 10px 5px">
                最大分数：
                <el-input placeholder="请输入内容" v-model="maxScore" style="width: 100px"
                    :disabled="!sectionIpt"
                    @blur="maxScoreCheck"
                    @keyup.enter.native="thisInputBlur($event)">
                </el-input>
            </div>

            <!--isometric-->
            <el-button-group v-show="!isometry"
                style="color: #a8a8a8;display: inline-block;width: 280px;margin: 5px 10px 5px">
                <el-button type="success" :class="{active2:backgroundColor5 == 0}" @click="isFIS()">
                    等距
                </el-button>
                <el-button type="success" :class="{active2:backgroundColor5 == 1}" @click="isNotFIS()">
                    异距
                </el-button>
            </el-button-group>

            <hr style="margin-top: 5px"/>

            <!--type-->
            <el-button-group style="margin: 10px 0px;margin-left: 2%;">
                <el-button type="primary" :class="{active1:backgroundColor3 == 0}" @click="typeRatio();typeRatio2();">
                    比例
                </el-button>
                <el-button type="primary" :class="{active1:backgroundColor3 == 1}" @click="typeNumber();typeNumber2()">
                    数量
                </el-button>
            </el-button-group>

            <!--chart-->
            <div id="myChart" :style="{width:'100%',height:'400px'}"></div>

            <!--PSI-->
            <div>
                <el-tag style="margin-bottom: 20px">PSI(日): {{dayPSI}}</el-tag>
                <el-tag style="margin-bottom: 20px">PSI(周): {{weekPSI}}</el-tag>
            </div>
        </el-card>

        <!--时间段-->
        <el-card class="box-card" id="chartProducts" style="margin-bottom: 30px">
            <!--日期段-->
            <div class="block" style="margin-bottom: 30px">
                <el-date-picker
                    v-model="timeSlot"
                    type="datetimerange"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getProductsData"
                    align="right">
                </el-date-picker>
            </div>
            <!--chart-->
            <div id="productsChart" :style="{width:'100%',height:'400px'}"></div>
        </el-card>


        <el-card class="box-card" id="chartAB" style="margin-bottom: 30px">
            <div style="display: flex;justify-content: space-around">
                <div id="SizerA">
                    <el-date-picker
                        v-model="AB.timeSlotA"
                        type="datetimerange"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getProductsDataA"
                        align="right">
                    </el-date-picker>
                </div>
                <div id="SizerB">
                    <el-date-picker
                        v-model="AB.timeSlotB"
                        type="datetimerange"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getProductsDataB"
                        align="right">
                    </el-date-picker>
                </div>
            </div>

            <!--chart-->
            <div id="ABChart" :style="{width:'100%',height:'400px'}"></div>
            <!--PSI-->
            <div>
                <el-tag style="margin-bottom: 20px">PSI(AB): {{ABPSI}}</el-tag>
            </div>

            <!-- PSI月度分布表 -->
            <div id="PSIMonthIn" style="margin:20px auto 0 auto">
                <h3>PSI月度分布<el-button @click="PSIMonthRefresh" style="margin:0 auto 0 20px">刷新</el-button></h3> 
                
                <el-table :data="tableDataPSIMonthIn">
                    <el-table-column prop="vertical" label="">
                    </el-table-column>

                    <el-table-column v-for="(item,index0) in PSIMonth" :key="index0" :prop="item[0]" :label= "item[0]">
                        <template slot-scope="scope" >
                            <el-popover trigger="hover" placement="top">
                            <p>{{scope.row[item[0]]}}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium" class="scopeRow" :class="scope.row[item[0]]>=0.2?'red':''" >{{scope.row[item[0]]}}</el-tag>
                            </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
            <!--type-->
            <el-button-group style="margin: 50px 0px 10px;margin-left: 2%;width: 300px">
                <!-- <el-button type="primary" :class="{active1:backgroundColor3 == 0}" @click="overdueDay">
                    逾期比例
                </el-button> -->
                <el-button type="primary" :class="{active1:backgroundColor6 == 1}" @click="overdue_num">
                    逾期数量
                </el-button>
                <el-button type="primary" :class="{active1:backgroundColor6 == 2}" @click="release_num">
                    放款数量
                </el-button>
            </el-button-group><br>
            <!--chart-->
            <div id="myOverdue" :style="{width:'100%',height:'600px'}"></div>


            <!--chart-->
            逾期&nbsp;
            <el-input-number v-model="num" :min='0' :max='31'  size="mini"  @change="handleChange" style="margin:10px 0 20px 0"></el-input-number>
            &nbsp;天
            <div id="ABOverdue" :style="{width:'100%',height:'400px'}"></div>

            <!--chart-->
            <el-button-group>
                <el-button type="primary" @click="monthOverdue(seriesMon)">数量</el-button>
                <el-button type="primary" @click="monthOverdue_Ratio(seriesMonRatio)">比例<i class=" el-icon--right"></i></el-button>
            </el-button-group>
            <div id="overdueMonth" :style="{width:'100%',height:'400px'}" style="margin-top:10px"></div>
        </el-card>

        <!--scoreTable-->
        <el-card class="box-card" id="table01" style="text-align: left;margin-bottom: 20px;text-align: center;">
            <el-row>
                <el-col :span="24">
                    <el-button-group style="white-space: nowrap">
                        <el-button type="primary" style="padding: 12px 10px" :class="{active1:backgroundColor4 == 0}"
                            @click="today(0)">
                            所选日
                        </el-button>
                        <el-button type="primary" style="padding: 12px 10px" :class="{active1:backgroundColor4 == 1}"
                            @click="lastWeek(1)">
                            前一周
                        </el-button>
                        <el-button type="primary" style="padding: 12px 10px" :class="{active1:backgroundColor4 == 2}"
                            @click="last30Days(2)">
                            前30天
                        </el-button>
                    </el-button-group>

                    <div style="margin: 0px auto 30px">
                        <el-table :data="tabledataobj" stripe header-align="center" border height="500"
                            style="min-width: 0px;max-height: 500px;margin-top: 50px;overflow-y: auto;overflow-x:
                            hidden;float:
                        right;text-align:center">
                            <el-table-column v-for="item in subTitle" :key="item" :prop="item" :label="item"
                                header-align="center" sortable>
                                {{item}}
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <!-- 模型KS值 -->
        <el-card class="box-card" id="chartAB" style="margin-bottom: 30px">
            <h4 style="margin:20px 0">KS值</h4>
            <el-table
                :data="tableDataOverdue"
                border
                style="width: 100%" 
                >
                <el-table-column prop="vertical" label="score" width="140" header-align='center'>
                </el-table-column>
                <el-table-column
                v-for="(item,index) in this.tableDataOverdueTo.score" :key='index'
                :label="item"
                :prop='item'
                 >
                    <!-- hover显示全部，采用overflow -->
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                        <p>{{ scope.row[item] }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium" class="scopeRow">{{ scope.row[item] }}</el-tag>
                        </div>
                        </el-popover>
                    </template>
                </el-table-column>

            </el-table>
            <!-- 逾期捕捉比例折线图 -->
            <div id="overdueCatch" class="marginTop60" :style="{width:'100%',height:'400px'}"></div>
            <!-- 逾期表现折线图 -->
            <div id="overdueExpression" class="marginTop60" :style="{width:'100%',height:'400px'}"></div>
        </el-card>
        <el-card class="box-card" id="chartAB" style="margin-bottom: 30px">
            <h4 style="margin:20px 0">CUT值监控</h4>
            <el-table
                :data="tableDataCut"
                border
                style="width: 100%">
                <el-table-column
                prop="data"
                label="CUT"
                width="140" header-align='center'>
                </el-table-column>
                <el-table-column header-align='center'  
                v-for="(item,index) in this.tableDataCutTo.label" :key= 'index'
                :prop="item"
                :label="item"
                width=""
                >
                </el-table-column>

            </el-table>
            <!-- CUT值监控柱状图 -->
            <div id="cutProportion" class="marginTop60" :style="{width:'100%',height:'400px'}"></div>
        </el-card>
    </div>
</template>

<script>
import { watch } from 'fs';

    export default {
        name: "chart",
        data() {
            return {
                applications: [],
                pickerOptions: {},
                myChart: {},
                productsChart: {},
                ABChart: {},
                chartDatas: {},
                dayPSI: 0,
                weekPSI: 0,
                productNames: [],
                channelIds: [],
                ischartDatas: false,
                tableData: {},
                formInline: {
                    user: '',
                    region: ''
                },
                tabledataobj: [],
                backgroundColor1: 0,
                backgroundColor2: 0,
                backgroundColor3: 0,
                backgroundColor4: 0,
                backgroundColor5: 0,
                backgroundColor6: 1, 
                scoreNames: [],
                oldNew: ["All", "isNew", "isOld"],
                isometry: true,
                sectionIpt: true,
                isNew: "All",
                thisDay: '',
                scoreName: 'appscore',
                subTitle: ["applicationId", "idNumber", "applyDate", "scoreName",
                    "productName", "channelId", "isNew", "appscore"],
                subSection: 100,
                maxScore: 1000,
                productName: ['全部'],
                channelId: ['0'],

                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                timeSlot: [new Date("2018-05-27"), new Date("2018-05-29")],
                chart2Names: [],
                seriesNb: [],
                seriesRt: [],
                AB: {
                    timeSlotA: [new Date("2018-05-27"), new Date("2018-05-29")],
                    timeSlotB: [new Date("2018-05-27"), new Date("2018-05-29")]
                },
                ABchartData: {
                    A: {all: {ratioData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],delinquencyRatio:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],delinquencyCount:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    applyCount:[]}},
                    B: {all: {ratioData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],delinquencyRatio:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],delinquencyCount:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    applyCount:[]}},
                },
                ABPSI: '',
                PSIMonth: [],
                tableDataPSIMonthIn: [],
                PSIMonthList:[],
                tableData123:{},
                flag:true,
                ABOverdue:{},
                num:10,
                myOverdue:{},
                overdueMonth:{},
                monthList:[],
                seriesMon:[],
                tableDataOverdue: [
                    {
                        vertical:'Grp_Size',
                    }, {
                        vertical:'Capture Rate',
                    }, {
                        vertical:'Capture Rate Exp',
                    }, {
                        vertical:'Bad Pct',
                    }, {
                        vertical:'Bad Pct Exp',
                    }
                ],
                overdueCatch:{},
                tableDataOverdueTo:[],
                    overdueExpression:{},
                tableDataCut: [
                    {
                    data:'800',
                    '通过整体率': '0.8',
                    '增益通过率': '0',
                    '通过逾期率': '12.00%',
                    '拒绝逾期率': 'NA'
                    },
                    {
                    data:'750',
                    '通过整体率': '0.7',
                    '增益通过率': '0.9',
                    '通过逾期率': '11.00%',
                    '拒绝逾期率': '21.00%'
                    },
                    {
                    data:'700',
                    '通过整体率': '0.6',
                    '增益通过率': '0.8',
                    '通过逾期率': '10.00%',
                    '拒绝逾期率': '20.00%'
                    },
                    {
                    data:'650',
                    '通过整体率': '0.4',
                    '增益通过率': '0.7',
                    '通过逾期率': '9.00%',
                    '拒绝逾期率': '19.00%'
                    },

                ],
                cutProportion:{},
                tableDataCutTo:{
                    // label:['overallPass','gainPass','passOverdue','RefuseOverdue']
                    // label:['800','750','700','650']
                    label:['通过整体率','增益通过率','通过逾期率','拒绝逾期率']
                },
                seriesMonRatio:[]
                
            }
        },
        updated(){

        },
        mounted() {
            this.$ajax.get('/home', {
                url: '/home',
                baseURL: process.env.API_BASEURL,
            }).then((res) => {
                this.productNames = res.data[0].productName;
                this.channelIds = res.data[0].channelId;
                this.scoreNames = res.data[0].scoreName;
            }).catch((err) => {
                console.log(err);
            });
            this.PSIMonthSub();
            this.drawLine();
            this.drawLine2();
            this.drawLineAB();
            this.overdueAB();
            this.getProductsData();
            this.overdueNum();
            this.monthOverdue_series();
            // hyg6.10
            this.overdueCatchWay();
            this.overdueExpressionWay()
            this.cutProportionWay()
            
            //监控bom大小;修改表格宽度
            window.onresize = () => {
                this.throttle(this.resize, window)
            };
        },
        
        methods: {
            //逾期数量
            overdue_num() {
                this.backgroundColor6 = 1;
                this.overdueNum(this.series_over())
            },

            //放款数量
            release_num() {
                this.backgroundColor6 = 2;
                this.overdueNum(this.series_release())
            },

            // 逾期天数
            handleChange(value){
                this.num = value
                if(this.flag){
                    this.flag =false
                    setTimeout(() => {
                        this.getProductsDataA()
                        this.getProductsDataB()
                        this.PSIMonthSub()
                        this.flag = true
                    }, 1000);
                }
            },
            open() {
                this.$message({
                    message: '刷新成功',
                    type: 'success'
                });
            },
            PSIMonthRefresh(){
                // PSI月度分布点击按钮防抖
                if(this.flag){
                    this.flag =false
                    setTimeout(() => {
                        this.flag = true
                        this.PSIMonthSub();
                        this.open()
                        
                    }, 2000);
                }
            },

            // PSI月度分布
            PSIMonthSub() {
                this.seriesMon.forEach((item3)=>{
                    item3.data=[]
                })
                // this.seriesMonRatio.forEach((item)=>{
                //     item.data=[]
                // })
                this.PSIMonth=[];
                this.tableDataPSIMonthIn=[];
                this.PSIMonthList=[];
                this.tableData123=[];
                let year = "2018";
                let month = '7';
                var timelock = true;
                let k=0;
                // let PSIMonth = [];
                function mGetDate(year, month){
                    var d = new Date(year, month, 0);
                    return d.getDate();
                }
                var atTimeYear = (new Date()).getFullYear()
                var atTimemonth = (new Date()).getMonth()
                while(timelock == true){
                    if(year < atTimeYear){
                        var day = mGetDate(year,month)
                        var data = year + "-" + month + "-" + 1
                        var data1 = year + "-" + month + "-" + day
                            this.PSIMonth.push([])
                            this.PSIMonth[k] = [data,data1]
                            k++;
                        month = parseInt(month) + 1;
                        if(month > 12){
                            year = parseInt(year) +1;
                            month = 1;
                        }
                    }else if(year == atTimeYear){
                        if(month <= atTimemonth){
                                var day = mGetDate(year,month)
                                var data = year + "-" + month + "-" + 1
                                var data1 = year + "-" + month + "-" + day
                                    this.PSIMonth.push([])
                                    this.PSIMonth[k] = [data,data1]
                                    k++;
                                month = parseInt(month) + 1;
                                if(month > 12){
                                    year = parseInt(year) +1;
                                    month = 1;
                                }
                            }else{
                            timelock = false;
                        }
                    }else{
                        timelock = false;
                    }            
                }
                localStorage.ki=this.PSIMonth;
                this.PSIMonth.forEach((item,index) => {
                    // PSI计算
                    this.$ajax.get('/' + this.scoreName,{
                        url: '/' + this.scoreName,
                        baseURL: process.env.API_BASEURL,
                        params: {
                            applyDate: item[0] + '|' + item[1],
                            maxScore: this.maxScore,
                            subSection: this.subSection,
                            channelId: this.channelId,
                            productName: this.productName,
                            isNew: this.isNew,
                            scoreName: this.scoreName,
                            sectionIpt: this.sectionIpt,
                            dpdCap:this.num
                            }
                        }).then(res => {
                            // 比例方便计算
                            console.log(this.seriesMonRatio,index,'638')
                            let data = this.SUM_OF(res.data.all.approveCount)
                            data.forEach((item,index)=>{
                                item = item.toFixed(4)
                                this.seriesMonRatio[index].data.push(item)
                            })

                            // 数组变换 echart渲染
                            res.data.all.approveCount.forEach((item1,i)=>{
                                this.seriesMon[i].data.push(item1)
                            })
                            item.push(res.data.all.ratioData) 
                            // bug
                            if(this.PSIMonth.length <  index+2){
                                setTimeout(()=>{
                                    this.APSI()
                                    this.tabledataPSI()
                                },1000)
                            }
                    })
                });
            },

            // KPI月份计算
            APSI() {
                this.PSIMonth.forEach((item,index) => {
                    for(var j = 0; j < this.PSIMonth.length; j++){
                        item.push(this.assessPSI(item[2],this.PSIMonth[j][2]))
                    }
                    this.$forceUpdate()
                })
            },

            // element PSI月份渲染
            tabledataPSI(){
                this.PSIMonthList= [];
                this.tableDataPSIMonthIn=[]
                this.PSIMonth.forEach((item,index) => {
                    this.PSIMonthList.push(item[0])

                })
                this.PSIMonth.forEach((item,index) => {
                    this.tableData123="";
                    this.tableData123 = {
                        vertical:item[0],
                    }
                    this.PSIMonthList.forEach((item1,index1) =>{
                        this.tableData123[item1] = item[index1+3]
                    })
                    this.tableDataPSIMonthIn.push(this.tableData123)
                })  
                // 初始显示状态  数量/比例
                this.monthOverdue(this.seriesMon)
                // this.monthOverdue_Ratio(this.seriesMon)
            },
            resize() {
                this.myChart.resize();
                this.productsChart.resize();
                this.ABChart.resize();
                this.ABOverdue.resize();
                this.myOverdue.resize();
                this.overdueCatch.resize();
                this.overdueExpression.resize();
                this.cutProportion.resize();
                this.overdueMonth.resize()
            },
            throttle(method, context) {
                clearTimeout(method.tId);
                method.tId = setTimeout(function () {
                    method.call(context);
                }, 500);
            },

            //echarts初始化
            drawLine() {
                this.myChart = this.$echarts.init(document.getElementById('myChart'), 'shine');
                this.myChart.setOption({
                    title: {
                        text: '用户score分布',
                        x: '0px',
                        y: '25px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        position: function (p) {   //其中p为当前鼠标的位置
                            return [p[0] - 65, p[1] - 10];
                        }
                    },
                    grid: {
                        left: 'center',
                        width: '95%',
                        top: '15%',
                        containLabel: true
                    },
                    legend: {
                        data: ['当日用户', '前一周用户', '前30天用户']
                    },
                    toolbox: {
                        show: true,
                        feature:
                            {
                                mark: {
                                    show: true
                                }
                                ,
                                dataView: {
                                    show: false,
                                    readOnly:
                                        false
                                }
                                ,
                                magicType: {
                                    show: true,
                                    type:
                                        ['line', 'bar', 'stack', 'tiled']
                                }
                                ,
                                restore: {
                                    show: true
                                }
                                ,
                                saveAsImage: {
                                    show: true
                                }
                            }
                        ,
                        x: 100,
                        y:
                            20
                    },
                    calculable: true,
                    xAxis:
                        [{
                            type: 'category',
                            boundaryGap: false,
                            data: this.xAxis(),
                            axisLabel: {
                                interval: 'auto',
                                rotate: 55
                            },
                        }],
                    yAxis:
                        {
                            type: 'value'
                        } ,
                    series: []
                });
            },

            //以数值展示图片
            typeNumber() {
                this.backgroundColor3 = 1;
                if (this.ischartDatas == true) {
                    this.myChart.setOption({
                        tooltip: {
                            align: 'left',
                            formatter: function (params) {
                                var relVal = params[0].name;
                                for (var i = 0, l = params.length; i < l; i++) {
                                    relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "人";
                                }
                                return relVal;
                            }
                        },

                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            data: this.xAxis(),
                            axisLabel: {
                                interval: 'auto',
                                rotate: 55
                            },
                        }],

                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                formatter: '{value}'
                            },
                        },

                        series: [
                            {
                                name: '前30天用户',
                                type: 'line',
                                smooth: false,
                                data: this.chartDatas.last30Days.chartData
                            }, {
                                name: '前一周用户',
                                type: 'line',
                                smooth: false,
                                data: this.chartDatas.lastWeek.chartData
                            }, {
                                name: '当日用户',
                                type: 'line',
                                smooth: false,
                                data: this.chartDatas.today.chartData
                            }]
                    });
                }
            },

            //以比例展示图片
            typeRatio() {
                this.backgroundColor3 = 0;
                if (this.ischartDatas == true) {
                    this.myChart.setOption({
                        tooltip: {
                            align: 'left',
                            formatter: function (params) {
                                var relVal = params[0].name;
                                for (var i = 0, l = params.length; i < l; i++) {
                                    if (params[i].value != "NaN") {
                                        relVal +=
                                            '<br/>' + params[i].seriesName + ' : ' + params[i].value + "%";
                                    } else {
                                        relVal +=
                                            '<br/>' + params[i].seriesName + ' : ' + '0' + "%";
                                    }
                                }
                                return relVal;
                            }
                        },

                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            data: this.xAxis(),
                            axisLabel: {
                                interval: 'auto',
                                rotate: 55
                            },
                        }],
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                formatter: '{value}%'
                            },
                        },

                        series: [
                            {
                                name: '前30天用户',
                                type: 'line',
                                smooth: false,
                                data: this.chartDatas.last30Days.ratioData
                            }, {
                                name: '前一周用户',
                                type: 'line',
                                smooth: false,
                                data: this.chartDatas.lastWeek.ratioData
                            }, {
                                name: '当日用户',
                                type: 'line',
                                smooth: false,
                                data: this.chartDatas.today.ratioData
                            }]
                    });
                }
            },

            //chart2图骨架
            drawLine2() {
                this.productsChart = this.$echarts.init(document.getElementById('productsChart'), 'shine');
                this.productsChart.clear();
                this.productsChart.setOption({

                    title: {
                        text: '产品score分布',
                        x: '0px',
                        y: '25px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },

                    tooltip: {
                        trigger: 'axis',
                        position: function (p) {   //其中p为当前鼠标的位置
                            return [p[0] - 65, p[1] - 10];
                        }
                    },

                    grid: {
                        left: 'center',
                        width: '95%',
                        top: '15%',
                        containLabel: true
                    },

                    legend: {
                        data: this.chart2Names
                    },

                    toolbox: {
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            dataView: {
                                show: false,
                                readOnly: false
                            },
                            magicType: {
                                show: true,
                                type: ['line', 'bar', 'stack', 'tiled']
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        },
                        x: 100,
                        y: 20
                    },

                    calculable: true,

                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis(),
                        axisLabel: {
                            interval: 'auto',
                            rotate: 55
                        },
                    }],

                    yAxis: {type: 'value'},

                    series: this.seriesRt
                });
            },

            //chart图 数量
            typeNumber2() {
                this.backgroundColor3 = 1;
                this.productsChart.setOption({
                    tooltip: {
                        align: 'left',
                        formatter: function (params) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "人";
                            }
                            return relVal;
                        }
                    },

                    legend: {
                        data: this.chart2Names
                    },

                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis(),
                        axisLabel: {
                            interval: 'auto',
                            rotate: 55
                        },
                    }],

                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value}'
                        },
                    },

                    series: this.seriesNb
                });

            },

            //chart图 比例
            typeRatio2() {
                this.backgroundColor3 = 0;
                this.productsChart.setOption({
                    tooltip: {
                        align: 'left',
                        formatter: function (params) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                if (params[i].value != "NaN") {
                                    relVal +=
                                        '<br/>' + params[i].seriesName + ' : ' + params[i].value + "%";
                                } else {
                                    relVal +=
                                        '<br/>' + params[i].seriesName + ' : ' + '0' + "%";
                                }
                            }
                            return relVal;
                        }
                    },
                    legend: {
                        data: this.chart2Names
                    },

                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis(),
                        axisLabel: {
                            interval: 'auto',
                            rotate: 55
                        },
                    }],

                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value}%'
                        },
                    },

                    series: this.seriesRt
                });
            },

            //修改x轴坐标区间段
            xAxis() {
                let arr = [];
                if (this.sectionIpt) {
                    var arrlength = Math.ceil(this.maxScore / this.subSection);
                    for (let i = 0; i < arrlength; i++) {
                        if ((arrlength - 1) == i) {
                            arr.push(i * this.subSection + "-" + this.maxScore + "分");
                            continue;
                        }
                        arr.push(i * this.subSection + "-" + (i + 1) * this.subSection + "分");
                    }
                    return arr
                } else {
                    arr = ["0-50分", "50-86分", "86-129分", "129-150分", "150-200分", "200-241分", "241-300分", "300-1000分",]
                    return arr
                }
            },

            //是否为新用户
            newOrOld(boolString, index) {
                this.backgroundColor2 = index;
                switch (boolString) {
                    case "isNew" :
                        this.isNew = 0;
                        break;
                    case "All" :
                        this.isNew = "All";
                        break;
                    case "isOld":
                        this.isNew = 1;
                        break;
                    default:
                        ;
                }
                if (this.thisDay) {
                    this.getDatas()
                }
                this.getProductsData()
            },

            //修改查询的scoreName
            changeScoreName(name, index) {
                this.backgroundColor1 = index;
                if (index == 1) {
                    this.isometry = false;
                } else {
                    this.isometry = true;
                }
                this.scoreName = name;
                this.subTitle[7] = name;
                if (this.thisDay) {
                    this.backgroundColor3 = 0;
                    this.isNew = this.oldNew[0];
                    this.backgroundColor2 = 0;
                    this.productName = ["全部"];
                    this.channelId = ['0'];
                    this.getDatas()
                }
                this.getProductsData()
            },

            //区间等距
            isFIS() {
                this.backgroundColor5 = 0;
                this.sectionIpt = true;
                this.getDatas();
                this.getProductsData()
            },

            //区间异距
            isNotFIS() {
                this.backgroundColor5 = 1;
                this.sectionIpt = false;
                this.getDatas();
                this.getProductsData()
            },

            //修改日期获取数据
            changeDate() {
                if (this.thisDay) {
                    this.getDatas()
                }
            },

            //验证分数区间
            sectionCheck() {
                if (this.subSection > 0 && this.subSection <= 1000) {
                    if (this.thisDay) {
                        this.getDatas()
                    }
                    this.getProductsData()
                } else {
                    this.$alert('数值不能为负或者超过最大值', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                    this.subSection = 100;
                }
            },

            //验证最大分数
            maxScoreCheck() {
                if ((this.maxScore - this.subSection) > 0) {
                    if (this.thisDay) {
                        this.getDatas()
                    }
                    this.getProductsData()
                } else {
                    this.$alert('数值需要大于区间段', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                    this.maxScore = 1000;
                }
            },

            //enter事件
            thisInputBlur(ev) {
                ev.target.blur();
            },

            //验证productName
            productNameCheck() {
                if (this.productName.length == 0) {
                    this.productName.push('全部');
                }
                ;

                if (this.productName.indexOf('全部') > -1 && this.productName.length > 1) {
                    this.productName.splice(this.productName.indexOf('全部'), 1);
                }

                if (this.thisDay) {
                    this.getDatas()
                }
                this.getProductsData()
            },

            //修改channelId
            channelIdCheck() {
                if (this.channelId.length == 0) {
                    this.channelId = ["0"]
                }
                if (this.channelId.indexOf('0') > -1 && this.channelId.length > 1) {
                    this.channelId.splice(this.channelId.indexOf('0'), 1);
                }
                if (this.thisDay) {
                    this.getDatas()
                }
                this.getProductsData()
            },

            //ajax请求数据
            getDatas() {
                this.$ajax.get('/' + this.scoreName,
                    {
                        url: '/' + this.scoreName,
                        baseURL: process.env.API_BASEURL,
                        params: {
                            applyDate: this.thisDay.toString(),
                            maxScore: this.maxScore,
                            subSection: this.subSection,
                            channelId: this.channelId,
                            productName: this.productName,
                            isNew: this.isNew,
                            scoreName: this.scoreName,
                            sectionIpt: this.sectionIpt
                        }
                    }).then(res => {
                    this.chartDatas = res.data;
                    this.ischartDatas = true;
                    var tableData = {
                        day: res.data.today.tableArr,
                        week: res.data.lastWeek.tableArr,
                        month: res.data.last30Days.tableArr,
                    };
                    this.dayPSI =
                        this.assessPSI(this.chartDatas.today.ratioData, this.chartDatas.last30Days.ratioData);
                    this.weekPSI =
                        this.assessPSI(this.chartDatas.lastWeek.ratioData, this.chartDatas.last30Days.ratioData);

                    this.tableData = tableData;
                    this.tabledataobj = this.tableData.day;
                }).then(() => {
                    if (this.backgroundColor3 == 0) {
                        this.typeRatio();
                    } else if (this.backgroundColor3 == 1) {
                        this.typeNumber();
                    }

                })
            },

            //计算PSI
            assessPSI(ratio1, ratio2) {
                var PSI = 0;
                for (var i = 0; i < Math.ceil(this.maxScore / this.subSection); i++) {
                    if (parseFloat(ratio2[i]) != 0 && parseFloat(ratio1[i]) != 0) {
                        PSI += (ratio1[i] - ratio2[i]) / 100 * Math.log(parseFloat(ratio1[i]) / parseFloat(ratio2[i]));
                    }
                }
                if (PSI) {
                    return PSI
                } else {
                    return 0
                }


            },

            //table按钮1
            today(index) {
                this.backgroundColor4 = index;
                this.tabledataobj = this.tableData.day;
            },

            //table按钮2
            lastWeek(index) {
                this.backgroundColor4 = index;
                this.tabledataobj = this.tableData.week;
            },

            //table按钮3
            last30Days(index) {
                this.backgroundColor4 = index;
                this.tabledataobj = this.tableData.month;
            },

            //获取所有产品对应数据
            getProductsData() {
                if (this.timeSlot == null) return;
                this.$ajax.get('/productsData',
                    {
                        url: '/productsData',
                        baseURL: process.env.API_BASEURL,
                        params: {
                            timeSlot: this.timeSlot,
                            sectionIpt: this.sectionIpt,
                            maxScore: this.maxScore,
                            subSection: this.subSection,
                            dayNb: this.timeSlot,
                            productName: this.productName,
                            channelId: this.channelId,
                            isNew: this.isNew,
                            scoreName: this.scoreName
                        }
                    }).then(res => {
                    this.chart2Names = [];
                    this.seriesNb = [];
                    this.seriesRt = [];

                    for (var i in res.data) {
                        if (i.indexOf('_') != 0) {
                            this.chart2Names.push(i);
                            this.seriesNb.push({
                                name: i,
                                type: 'line',
                                smooth: false,
                                data: res.data[i]
                            });
                            this.seriesRt.push({
                                name: i,
                                type: 'line',
                                smooth: false,
                                data: res.data["_" + i]
                            })
                        }

                    }

                }).then(() => {
                    this.drawLine2();
                    if (this.backgroundColor3 == 0) {
                        this.typeRatio2();
                    }

                });
            },

            //getProductsDataA
            getProductsDataA() {
                this.$ajax.get('/' + this.scoreName,
                    {
                        url: '/' + this.scoreName,
                        baseURL: process.env.API_BASEURL,
                        params: {
                            applyDate: this.AB.timeSlotA[0].toString() + '|' + this.AB.timeSlotA[1].toString(),
                            maxScore: this.maxScore,
                            subSection: this.subSection,
                            channelId: this.channelId,
                            productName: this.productName,
                            isNew: this.isNew,
                            scoreName: this.scoreName,
                            sectionIpt: this.sectionIpt,
                            dpdCap:this.num
                        }
                    }).then(res => {
                        // console.log(res,'getProductsDataA')
                        this.ABchartData.A = res.data;
                        this.ischartDatas = true;   
                        this.ABPSI =
                        this.assessPSI(this.ABchartData.A.all.ratioData, this.ABchartData.B.all.ratioData);
                            sectionIpt: this.sectionIpt
                        this.overdueAB();
                        this.overdueNum();
                        this.overdue_num();
                        this.KS_TablePrice(res);
                }).then(() => {
                    if (this.backgroundColor3 == 0) {
                        this.typeRatioAB(true);
                    } else if (this.backgroundColor3 == 1) {
                        
                        this.typeNumberAB(true);
                    }
                })
            },
            //getProductsDataB
            getProductsDataB() {
                this.$ajax.get('/' + this.scoreName, {
                    url: '/' + this.scoreName,
                    baseURL: process.env.API_BASEURL,
                    params: {
                        applyDate: this.AB.timeSlotB[0].toString() + '|' + this.AB.timeSlotB[1].toString(),
                        maxScore: this.maxScore,
                        subSection: this.subSection,
                        channelId: this.channelId,
                        productName: this.productName,
                        isNew: this.isNew,
                        scoreName: this.scoreName,
                        sectionIpt: this.sectionIpt,
                        dpdCap:this.num
                    }
                })
                    .then(res => {

                        this.ABchartData.B = res.data;
                        this.ischartDatas = true;
                        this.ABPSI =
                            this.assessPSI(this.ABchartData.A.all.ratioData, this.ABchartData.B.all.ratioData);
                        this.overdueAB();
                        this.overdueNum();
                        this.overdue_num();
                        this.KS_TablePrice(res);
                    })
                    .then(() => {
                        if (this.backgroundColor3 == 0) {
                            this.typeRatioAB(false);
                        } else if (this.backgroundColor3 == 1) {
                            this.typeNumberAB(false);
                        }
                    })
            },
            // cut值监控

            // ks值表格
            KS_TablePrice(data){
                data = data.data.all
                // score
                let score = this.xAxis();
                // Grp_size值
                let Grp_Size = data.applyCount;
                // CaptureRate   n/ΣdelinquencyCount array
                let CaptureRate = this.SUM_OF(data.delinquencyCount);
                let CaptureRateExp = this.SUM_OF(data.delinquencyCount);

                // Bad pct
                let BadPct = this.SUM_OF(data.delinquencyRatio);
                let BadPctExp = this.SUM_OF(data.delinquencyRatio);

                // 重新加载
                this.tableDataOverdueTo.score=score
                // this.tableDataOverdueTo.Grp_Size=Grp_Size
                // this.tableDataOverdueTo.CaptureRate = CaptureRate.filter( function (item){
                //     return item == '0'?null:item
                // }) 
                // this.tableDataOverdueTo.BadPct=BadPct.filter( function (item){
                //     return item == '0'?null:item
                // }) 
                // 模拟数据
                this.tableDataOverdueTo.Grp_Size = ['200','1000','3000','3500','4000','5000','2000','1500','1000','500']
                this.tableDataOverdueTo.KS = ['0.2','0.3','0.4','0.35','0.2','0.15','0.1','0.05','0.03','0']
                this.tableDataOverdueTo.CaptureRate = [0.4,0.7 ,0.8,0.85,0.9,0.94,0.97,0.99,1,1]
                this.tableDataOverdueTo.CaptureRateExp=[0.3,0.5 ,0.65,0.7,0.75,0.8,8.5,0.9,0.95,1]

                this.tableDataOverdueTo.BadPct = [0.13,0.12 ,0.08,0.07,0.06,0.07,0.6,0.5,0.5,0.6]
                this.tableDataOverdueTo.BadPctExp=['0.15','0.13','0.12','0.10','0.6','0.5','0.4','0.3',0.2,0.1]

                this.overdueExpressionWay()
                this.overdueCatchWay()

                this.tableDataOverdue.forEach((item,index)=>{
                    switch(item.vertical){
                        case 'Grp_Size':
                            score.forEach((itemA,indexA)=>{
                                item[itemA] = this.tableDataOverdueTo.Grp_Size[indexA]
                            })
                            break;
                        case 'Capture Rate':
                            score.forEach((itemA,indexA)=>{
                                item[itemA] = this.tableDataOverdueTo.CaptureRate[indexA]
                            })
                            break;
                        case 'Capture Rate Exp':
                            score.forEach((itemA,indexA)=>{
                                item[itemA] = this.tableDataOverdueTo.BadPct[indexA]
                            })
                            break;
                        case 'Bad Pct':
                            score.forEach((itemA,indexA)=>{
                                item[itemA] = this.tableDataOverdueTo.BadPct[indexA]
                            })
                            break;
                        case 'Bad Pct Exp':
                            score.forEach((itemA,indexA)=>{
                                item[itemA] = this.tableDataOverdueTo.BadPct[indexA]
                            })
                            break;
                    }
                    
                }) 
            },
            // 之和总比单个比列
            SUM_OF(data){
                let sum = 0,arrSUM_OF=[]
                data.forEach((item,index)=>{
                    item = item == NaN? 0: item
                    sum += item
                });
                data.forEach((item,index)=>{
                    item = item == NaN? 0: item
                    if(sum != 0){
                        arrSUM_OF.push(item/sum)  
                    }else{
                        arrSUM_OF.push(0)
                    }
                });
                return arrSUM_OF;
            },

            //以数值展示图片
            typeNumberAB() {
                this.backgroundColor3 = 1;
                if (this.ischartDatas == true) {
                    this.ABChart.setOption({
                        tooltip: {
                            align: 'left',
                            formatter: function (params) {
                                var relVal = params[0].name;
                                for (var i = 0, l = params.length; i < l; i++) {
                                    relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "人";
                                }
                                return relVal;
                            }
                        },

                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            data: this.xAxis(),
                            axisLabel: {
                                interval: 'auto',
                                rotate: 55
                            },
                        }],

                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                formatter: '{value}'
                            },
                        },

                        series: [
                            {
                                name: 'A',
                                type: 'line',
                                smooth: false,
                                data: this.ABchartData.A.all.chartData
                            }, {
                                name: 'B',
                                type: 'line',
                                smooth: false,
                                data: this.ABchartData.B.all.chartData
                            }]
                    });
                }
            },

            //以比例展示图片
            typeRatioAB() {
                this.backgroundColor3 = 0;
                if (this.ischartDatas == true) {
                    this.ABChart.setOption({
                        tooltip: {
                            align: 'left',
                            formatter: function (params) {
                                var relVal = params[0].name;
                                for (var i = 0, l = params.length; i < l; i++) {
                                    if (params[i].value != "NaN") {
                                        relVal +=
                                            '<br/>' + params[i].seriesName + ' : ' + params[i].value + "%";
                                    } else {
                                        relVal +=
                                            '<br/>' + params[i].seriesName + ' : ' + '0' + "%";
                                    }
                                }
                                return relVal;
                            }
                        },
                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            data: this.xAxis(),
                            axisLabel: {
                                interval: 'auto',
                                rotate: 55
                            },

                        }],
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                formatter: '{value}%'
                            },
                        },
                        series: [
                            {
                                name: 'A',
                                type: 'line',
                                smooth: false,
                                data: this.ABchartData.A.all.ratioData
                            }, {
                                name: 'B',
                                type: 'line',
                                smooth: false,
                                data: this.ABchartData.B.all.ratioData
                            }]
                    });
                }
            },

            drawLineAB() {
                this.ABChart = this.$echarts.init(document.getElementById('ABChart'), 'shine');
                this.ABChart.setOption({
                    title: {
                        text: '用户score对比',
                        x: '0px',
                        y: '25px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (datas) {
                        var res = datas[0].name + '<br/>'
                        for (var i = 0, length = datas.length; i < length; i++) {
                           res += datas[i].marker + " " + datas[i].seriesName + '：' 
                               + Math.round(datas[i].data*10000)/100+'%' + '<br/>'
                         }
                         return res
                       }
                    },

                    grid: {
                        left: 'center',
                        width: '95%',
                        top: '15%',
                        containLabel: true
                    },

                    legend: {
                        data: ['A', 'B']
                    },

                    toolbox: {
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            dataView: {
                                show: true,
                                readOnly: false
                            },
                            magicType: {
                                show: true,
                                type: ['line', 'bar', 'stack', 'tiled']
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        },
                        x: 100,
                        y: 20
                    },

                    calculable: true,

                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis(),
                        axisLabel: {
                            interval: 'auto',
                            rotate: 55
                        },
                    }],

                    yAxis: {
                        type: 'value',
                        axisLabel :{
                            formatter:x=>Math.round(x*10000)/100+'%'
                        }
                    },

                    series: [
                        {
                            name: 'A',
                            type: 'line',
                            smooth: false,
                            data: this.ABchartData.A.all.ratioData
                        }, {
                            name: 'B',
                            type: 'line',
                            smooth: false,
                            data: this.ABchartData.B.all.ratioData
                        }]
                });
            },
            overdueAB(){
                this.ABOverdue = this.$echarts.init(document.getElementById('ABOverdue'), 'shine');
                this.ABOverdue.setOption({
                    title: {
                        text: '用户逾期对比',
                        x: '0px',
                        y: '25px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (datas) {
                        var res = datas[0].name + '<br/>'
                        for (var i = 0, length = datas.length; i < length; i++) {
                           res += datas[i].marker + " " + datas[i].seriesName + '：' 
                               + Math.round(datas[i].data*10000)/100+'%' + '<br/>'
                         }
                         return res
                       }
                    },

                    grid: {
                        left: 'center',
                        width: '95%',
                        top: '15%',
                        containLabel: true
                    },

                    legend: {
                        data: ['A', 'B']
                    },

                    toolbox: {
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            dataView: {
                                show: true,
                                readOnly: false
                            },
                            magicType: {
                                show: true,
                                type: ['line', 'bar', 'stack', 'tiled']
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        },
                        x: 100,
                        y: 20
                    },

                    calculable: true,

                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis(),
                        axisLabel: {
                            interval: 'auto',
                            rotate: 55
                        },
                    }],

                    yAxis: {
                        type: 'value',
                        axisLabel :{
                            formatter:x=>Math.round(x*10000)/100+'%'
                        }
                    },

                    series: [
                        {
                            name: 'A',
                            type: 'line',
                            smooth: false,
                            data: this.ABchartData.A.all.delinquencyRatio
                        }, {
                            name: 'B',
                            type: 'line',
                            smooth: false,
                            data: this.ABchartData.B.all.delinquencyRatio
                        }]
                });
            },
            //逾期分布数量
            overdueNum(series) {
                this.myOverdue = this.$echarts.init(document.getElementById('myOverdue'), 'shine');
                this.myOverdue.clear();
                this.myOverdue.setOption({
                    title: {
                        text: '用户对比',
                        x: '0px',
                        y: '25px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },

                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },

                    grid: {
                        left: 'center',
                        width: '95%',
                        top: '15%',
                        containLabel: true
                    },

                    legend: {
                        // data: ['A', 'B']
                    },

                    toolbox: {
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            dataView: {
                                show: true,
                                readOnly: false
                            },
                            magicType: {
                                show: true,
                                type: ['line', 'bar', 'stack', 'tiled']
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        },
                        x: 100,
                        y: 20
                    },

                    calculable: true,

                    xAxis: [{
                        type: 'category',
                        data: this.xAxis(),
                    }],

                    yAxis: {
                        type: 'value',
                        position :'top',
                        nameLocation:'start'
                    },
                    series:series
                });
            },
            series_over(){
                return [{
                        name: 'A',
                        type: 'bar',
                        smooth: false,
                        data: this.ABchartData.A.all.delinquencyCount
                    },{
                        name: 'B',
                        type: 'bar',
                        smooth: false,
                        data: this.ABchartData.B.all.delinquencyCount
                }]
            },
            series_release(){
                return [{
                        name: 'A',
                        type: 'bar',
                        smooth: false,
                        data: this.ABchartData.A.all.applyCount
                    },{
                        name: 'B',
                        type: 'bar',
                        smooth: false,
                        data: this.ABchartData.B.all.applyCount
                }]
            },
            // 放款月份柱状图
            monthOverdue(series){
                this.overdueMonth = this.$echarts.init(document.getElementById('overdueMonth'),'shine')
                this.overdueMonth.clear()
                this.overdueMonth.setOption({
                    title: {
                        text: '放款月份对比',
                        x: '0px',
                        y: '25px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },

                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "人";
                            }
                            return relVal;
                        },
                    },

                    legend: {
                    },

                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },

                    yAxis: [{
                        type: 'value',
                        formatter:function(params){
                            
                        }
                    }],

                    xAxis: {
                        type: 'category',
                        data:this.PSIMonthList,
                    },

                    series:series
                })
            },
            // 放款月份柱状图 比例
            monthOverdue_Ratio(series){
                this.overdueMonth = this.$echarts.init(document.getElementById('overdueMonth'),'shine')
                this.overdueMonth.clear()
                this.overdueMonth.setOption({
                    title: {
                        text: '放款月份对比',
                        x: '0px',
                        y: '25px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },

                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {        // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'    // 默认为直线，可选为：'line' | 'shadow'
                        },
                        // formatter: function (params) {
                        //     console.log(params,'1994')
                        //     var relVal =  params[0].name;
                        //     var num = 0;
                        //     for(var i = 0;i < params.length; i++){
                        //         num = num + params[i].value
                        //     }
                        //     for(var j = 0; j < params.length; j++){
                        //         relVal += '<br/>' + params[j].seriesName + ' : ' + ((params[j].value/num)*100) + '%';
                        //     }
                        //     return relVal;
                        // },
                        formatter: function (datas) {
                        var res = datas[0].name + '<br/>'
                        for (var i = 0, length = datas.length; i < length; i++) {
                           res += datas[i].marker + " " + datas[i].seriesName + '：' 
                               + Math.round(datas[i].data*10000)/100+'%' + '<br/>'
                         }
                         return res
                       }
                    },

                    legend: {
                    },

                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },

                    yAxis: [{
                    }],

                    xAxis: {
                        type: 'category',
                        data:this.PSIMonthList,
                        axisLabel: {
                            interval: 'auto',
                            rotate: 55
                        },
                    },
                    series:series,
                })
            },

            monthOverdue_series(){
                this.xAxis().forEach((item,index)=>{
                    this.seriesMon.push({
                        name: item,
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: []
                    })
                    this.seriesMonRatio.push({
                        name: item,
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: []
                    })
                })
            },
            // 逾期捕捉比例折线图 
            overdueCatchWay(){
                this.overdueCatch = this.$echarts.init(document.getElementById('overdueCatch'))
                this.overdueCatch.clear()
                let option = {
                    title: {
                        text: '逾期捕捉比例'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (datas) {
                        var res = datas[0].name + '<br/>'
                        for (var i = 0, length = datas.length; i < length; i++) {
                           res += datas[i].marker + " " + datas[i].seriesName + '：' 
                               + Math.round(datas[i].data*10000)/100+'%' + '<br/>'
                         }
                         return res
                       }
                    },
                    legend: {
                        data:['CaptureRate','CaptureRateExp']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis()
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel :{
                            formatter:x=>Math.round(x*10000)/100+'%'
                        }
                    },
                    series: [
                        {
                            name:'CaptureRate',
                            type:'line',
                            smooth: false,
                            data:this.tableDataOverdueTo.CaptureRate
                        },
                        {
                            name:'CaptureRateExp',
                            type:'line',
                            smooth: false,
                            data:this.tableDataOverdueTo.CaptureRateExp
                        },
                        
                    ]
                };
                this.overdueCatch.setOption(option);
            },
            // 逾期表现折线图
            overdueExpressionWay(){
                this.overdueExpression = this.$echarts.init(document.getElementById('overdueExpression'))
                this.overdueExpression.clear()
                let option = {
                    title: {
                        text: '逾期表现'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (datas) {
                        var res = datas[0].name + '<br/>'
                        for (var i = 0, length = datas.length; i < length; i++) {
                           res += datas[i].marker + " " + datas[i].seriesName + '：' 
                               + Math.round(datas[i].data*10000)/100+'%' + '<br/>'
                         }
                         return res
                       }
                    },
                    legend: {
                        data:['BadPct','BadPctExp']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:  this.xAxis()
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel :{
                            formatter:x=>Math.round(x*10000)/100+'%'
                        }
                    },
                    series: [
                        {
                            name:'BadPct',
                            type:'line',
                            smooth: false,
                            data:this.tableDataOverdueTo.BadPct
                        },
                        {
                            name:'BadPctExp',
                            type:'line',
                            smooth: false,
                            data:this.tableDataOverdueTo.BadPctExp
                        },
                        
                    ]
                };
                this.overdueExpression.setOption(option);
            },
            // CUT柱状图
            cutProportionWay(){
                this.cutProportion = this.$echarts.init(document.getElementById('cutProportion'));
                this.cutProportion.clear();
                let option = {
                    legend: {},
                    tooltip: {
                    },
                    dataset: {
                        source: [
                            ['product', '2015', '2016'],
                            ['800', 43.3, 85.7],
                            ['750', 83.1, 73.4],
                            ['700', 86.4, 65.2],
                            ['650', 72.4, 53.9]
                        ]
                    },
                    xAxis: {type: 'category'},
                    yAxis: {
                        axisLabel :{
                            formatter:x=>Math.round(x*100)/100+'%'
                        }
                    },
                    series: [
                        {type: 'bar'},
                        {type: 'bar'},
                        // {type: 'bar'}
                    ],
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                };
                this.cutProportion.setOption(option)
            }
        },
    }
</script>

<style scoped>
    table{
        overflow:auto; 
    }
    tr,th,td{
        /* border:0; */
        padding: 10px;
    }
    #home {
        margin: 10px;
        padding: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
    }

    .mr {
        background: #409EFF;
    }

    .active1 {
        background: #0078f5 !important;
        border: #3a8ee6 1px solid !important;
    }

    .active2 {
        background: #328609 !important;
        border: #328609 1px solid !important;
    }

    .scopeRow{
        white-space: normal;
        overflow: hidden;
        width: 59px !important;
    }
    .red{
        color: red;
    }
    .marginTop60{
        margin: 60px 0 0 0;
    }

</style>
