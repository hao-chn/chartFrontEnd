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
            <div id="PSIMonthIn">
                <h3 style="margin:20px 0">PSI月度分布</h3> 
                <button @click="">刷新</button>

                <table   border="1" cellspacing="0">
                    <tr style="padding:20px;" id="across">
                        <th></th>
                        <th v-for="(title,index3) in this.PSIMonth" :key="index3" >{{title[0]}}</th>
                    </tr>
                    <tr v-for="(td,index4) in this.PSIMonth" :key="index4" id="vertical">
                        <th>{{td[0]}}</th>

                        <td v-for="(dd,index5) in td" v-if="!(index5 == 0 || index5 == 1 || index5 == 2)">{{td[index5]}}</td>  
                        <!-- <td>{{td[4]}}</td>
                        <td>{{td[5]}}</td>
                        <td>{{td[6]}}</td>
                        <td>{{td[7]}}</td>
                        <td>{{td[8]}}</td>
                        <td>{{td[9]}}</td>  
                        <td>{{td[10]}}</td>  -->
                    </tr> 
                </table>
            </div>
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

    </div>
</template>

<script>

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
                    A: {all: {ratioData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}},
                    B: {all: {ratioData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}},
                },
                ABPSI: '',
                // MonthArray: ['2018-07','2018-08','2018-09','2018-10','2018-07','2018-07','2018-07','2018-07'],
                PSIMonth: [],
                PSIchartData: {
                    A: {all: {ratioData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}},
                    B: {all: {ratioData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}},
                },

            }
        },
        updated(){
            // this.$nextTick(function(){
            //     alert("此处填每次渲染完后执行的代码")
            // })
        },
        mounted() {
            // this.$nextTick(function(){
            //     alert("此处填第一次渲染完成后执行的代码")
            // })    
            this.$ajax.get('/home', {
                url: '/home',
                baseURL: process.env.API_BASEURL,
            }).then((res) => {
                console.log(res);
                this.productNames = res.data[0].productName;
                this.channelIds = res.data[0].channelId;
                this.scoreNames = res.data[0].scoreName;
            }).catch((err) => {
                console.log(err);
            });
            this.drawLine();
            this.drawLine2();
            this.drawLineAB();
            this.getProductsData();
            this.PSIMonthSub();

            //监控bom大小;修改表格宽度
            window.onresize = () => {
                this.throttle(this.resize, window)
            };
            
        },
        
        methods: {
            // PSI月度分布
            PSIMonthSub() {
                let year = "2018";
                let month = '7';
                var timelock = true;
                let k=0;
                let PSIMonth = [];
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
                
                this.PSIMonth.forEach((item,index) => {
                    console.log(item)
                    // PSI计算
                    this.$ajax.get('/' + this.scoreName,{
                        url: '/' + this.scoreName,
                        baseURL: process.env.API_BASEURL,
                        params: {
                            // applyDate: AB.timeSlotA[0].toString() + '|' + AB.timeSlotA[1].toString(),
                            applyDate: item[0] + '|' + item[1],
                            maxScore: this.maxScore,
                            subSection: this.subSection,
                            channelId: this.channelId,
                            productName: this.productName,
                            isNew: this.isNew,
                            scoreName: this.scoreName,
                            sectionIpt: this.sectionIpt
                            }
                        }).then(res => {
                            // this.PSIchartData.A = res.data;
                            item.push(res.data.all.ratioData) 
                            // console.log(this.PSIMonth.length,index)
                            if(this.PSIMonth.length <  index+2){
                                setTimeout(()=>{
                                    this.APSI()
                                },1000)
                            }
                    }).then(() => {
                        
                    })
                    
                    // }
                });
                
                // this.$nextTick()
            },
            
            APSI() {
                this.PSIMonth.forEach((item,index) => {
                    for(var j = 0; j < this.PSIMonth.length; j++){
                        item.push(this.assessPSI(item[2],this.PSIMonth[j][2]))
                    }
                    this.$forceUpdate()
                    console.log(this.PSIMonth)
                })
            },
            resize() {
                this.myChart.resize();
                this.productsChart.resize();
                this.ABChart.resize();
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
                    }
                    ,

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
                    }
                    ,

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
                        }
                    ,

                    series: []
                })
                ;
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
                // function myDate(){
                //     var myDate = new Date();
                //         var F=myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                //         var  M=myDate.getMonth()+1; //获取当前月份(0-11,0代表1月) // 所以获取当前月份是myDate.getMonth()+1;
                //         var D=myDate.getDate();
                //         alert(F+"-"+M+"-"+D)
                // }

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
                            sectionIpt: this.sectionIpt
                        }
                    }).then(res => {
                        this.ABchartData.A = res.data;
                        this.ischartDatas = true;   
                        this.ABPSI =
                        this.assessPSI(this.ABchartData.A.all.ratioData, this.ABchartData.B.all.ratioData);
                            sectionIpt: this.sectionIpt
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
                        sectionIpt: this.sectionIpt
                    }
                })
                    .then(res => {
                        this.ABchartData.B = res.data;
                        this.ischartDatas = true;
                        this.ABPSI =
                            this.assessPSI(this.ABchartData.A.all.ratioData, this.ABchartData.B.all.ratioData);
                    })
                    .then(() => {
                        if (this.backgroundColor3 == 0) {
                            this.typeRatioAB(false);
                        } else if (this.backgroundColor3 == 1) {
                            this.typeNumberAB(false);
                        }
                    })
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
                        data: ['A', 'B']
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
    #PSIMonthIn{
        position: relative;
        overflow: auto;

    }
    #PSIMonthIn table {
        width: 100%;
        overflow: auto;
        color: #909399;
        border-color: #ebeef5;
        border-right-color: #ebeef5 !important;
        border-bottom-color: #ebeef5 !important;
    }
    #PSIMonthIn td{
        border-left: 0;
        border-top:0;
        border-right-color: #ebeef5 !important;
        border-bottom-color: #ebeef5 !important;
    }
    #PSIMonthIn tr{
        border-right-color: #ebeef5 !important;
        border-bottom-color: #ebeef5 !important;
    }
    #vertical th{
        border-right:1px solid #9a9ca1;
    }
    #across th{
        border-bottom:1px solid #9a9ca1;
    }
    #PSIMonthIn button{
        padding: 10px;
        background: #409EFF;
        color: #fff;
        font-size: 16px;
        border-radius: 5px;
        margin: 20px;
        position: absolute;
        top: -30px;
        right: 400px;
    }
</style>
