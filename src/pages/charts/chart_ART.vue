
<template>
    <div id="chart_ART">
        <el-card class="box-card" id="chart" style="margin-top: 60px;margin-bottom: 30px">
            <!--date-->
            <div style="display: inline-block">
                <el-date-picker v-model="thisDay" type="datetime" placeholder="选择日期时间" align="right"
                    format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                    @change="changeDate" style="margin: 10px 20px">
                </el-date-picker>
            </div>


            <!--weeksNb-->
            <div class="demo-input-suffix"
                style="color: #a8a8a8;display: inline-block;width: 280px;margin: 5px 10px 5px">
                向前周数：
                <el-input placeholder="请输入内容" v-model="weeksNb" style="width: 100px"
                    :disabled="!sectionIpt"
                    @blur="nbWeeksAgo"
                    @keyup.enter.native="thisInputBlur($event)">
                </el-input>
            </div>

            <!--newORold-->
            <el-button-group style="margin-left: 2%;white-space: nowrap;">
                <el-button v-for="(item2,index2) in oldNew" type="success"
                    :key="item2"
                    @click="newOrOld(item2,index2)"
                    :class="{active2:backgroundColor2 == index2}"
                    style="padding: 12px 10px">
                    {{item2}}
                </el-button>
            </el-button-group>

            <!--channelId-->
            <el-form ref="form" label-width="60px"
                style="display: inline-block;line-height:40px;margin:10px 1% 20px
                2%;">
                <el-form-item label="渠道：">
                    <el-select multiple v-model="channelId" @input="channelIdCheck" placeholder="channelId">
                        <el-option v-for="item in channelIds" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <hr>

            <!--type-->
            <el-button-group style="margin: 10px 0px;margin-left: 2%;width: 300px">
                <el-button type="primary" :class="{active1:backgroundColor3 == 0}" @click="typeRatio">
                    批复比例
                </el-button>
                <el-button type="primary" :class="{active1:backgroundColor3 == 1}" @click="typeReply">
                    批复分布
                </el-button>
                <el-button type="primary" :class="{active1:backgroundColor3 == 2}" @click="typeApply">
                    申请分布
                </el-button>
            </el-button-group>


            <!--chart-->
            <div id="myChart" :style="{width:'100%',height:'600px'}"></div>
        </el-card>

        <el-card class="box-card" style="margin-bottom: 30px;text-align: center">
            <div class="block">
                <h3><b>渠道进件变动情况</b></h3>

                    <el-date-picker
                        v-model="decTime.timeSlotA"
                        type="datetimerange"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getChannel"
                        align="center"
                        style="margin:1em">
                    </el-date-picker>

            </div>
            <div id="channelFlow" :style="{width:'100%',height:'600px'}">
            </div>
        </el-card>

        <!--channelTable-->
        <el-card class="box-card" id="channelT" style="text-align: left;margin-bottom: 20px;text-align: center;">
            <el-row>
                <el-col :span="24">
                    <div>
                        <h3><b>渠道进件表格</b></h3>
                    </div>
                    <div style="margin: 0px auto 30px">
                        <el-table :data="tableData" stripe header-align="center" border height="500"
                            style="min-width: 0px;margin-top: 1em;overflow-y: auto;overflow-x:
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

        <el-card class="box-card" style="margin-bottom: 30px">
            <div id="main" :style="{width:'100%',height:'600px'}"></div>
        </el-card>


    </div>
</template>

<script>
    export default {

        name: "chart_ART",

        data() {
            return {
                thisDay: new Date(),
                weeksNb: 7,
                sectionIpt: true,
                oldNew: ["All", "isNew", "isOld"],
                isNew: "All",
                backgroundColor2: 0,
                xaxis: ["2018/3/17-2018/3/23",
                    "2018/3/24-2018/3/30", "2018/3/31-2018/4/6", "2018/4/7-2018/4/13", "2018/4/14-2018/4/20",
                    "2018/4/21-2018/4/27", "2018/4/28-2018/5/4"],
                dataArr: {},
                backgroundColor3: 0,
                channelId: ["0"],
                channelIds: [],
                decTime: {
                    timeSlotA:[new Date("2018-05-27"), new Date("2018-05-29")],
                    timeSlotB:[new Date("2018-05-27"), new Date("2018-05-29")]
                },
                dpdOption : {
                    title : {
                        text: '全国逾期率(dpd>=10)统计',
                        subtext: '易借款2017年11月-2018年5月'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    legend: {
                        x:'right',
                        selectedMode:true,
                        data:[]
                    },
                    dataRange: {
                        orient: 'horizontal',
                        min: 0.2,
                        max:0.5,
                        formatter:x=>Math.round(x*10000)/100+'%',
                        text:['高','低'],           // 文本，默认为数值文本
                        splitNumber:0
                    },
                    toolbox: {
                        show : true,
                        orient: 'vertical',
                        x:'right',
                        y:'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false}
                        }
                    },
                    series : [
                        {
                            name: '全国逾期率(dpd>=10)统计',
                            type: 'map',
                            mapType: 'china',
                            mapLocation: {
                                x: 'center'
                            },
                            selectedMode : 'multiple',
                            itemStyle:{
                                normal:{label:{show:true}},
                                emphasis:{label:{show:true}}
                            },
                            data:[
                                {name:'西藏', value:.4},
                                {name:'青海', value:.3636},
                                {name:'宁夏', value:.3103},
                                {name:'海南', value:.4},
                                {name:'甘肃', value:.4478},
                                {name:'贵州', value:.4255},
                                {name:'新疆', value:.3611},
                                {name:'云南', value:.4423},
                                {name:'重庆', value:.3741},
                                {name:'吉林', value:.4234},
                                {name:'山西', value:.37},
                                {name:'天津', value:.2716},
                                {name:'江西', value:.4095},
                                {name:'广西', value:.3942},
                                {name:'陕西', value:.3544},
                                {name:'黑龙江', value:.3898},
                                {name:'内蒙古', value:.4588},
                                {name:'安徽', value:.2766},
                                {name:'北京', value:.2945},
                                {name:'福建', value:.4552},
                                {name:'上海', value:.2464},
                                {name:'湖北', value:.3491},
                                {name:'湖南', value:.3470},
                                {name:'四川', value:.381},
                                {name:'辽宁', value:.371},
                                {name:'河北', value:.3724},
                                {name:'河南', value:.3058},
                                {name:'浙江', value:.2912},
                                {name:'山东', value:.3397},
                                {name:'江苏', value:.2965},
                                {name:'广东', value:.3757}
                            ]
                        },
                        
                    ],
                    animation: false
                },
                tableData: [],
                subTitle: [],
                channelOption:{
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data:["oppo自然量","应用宝","分享链接","其他","其他推广渠道","vivo","应用分发","钱包尾量","信息流","搜索推广"]
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : ["2018-07-01", "2018-07-02", "2018-07-03", "2018-07-04", "2018-07-05", "2018-07-06", "2018-07-07", "2018-07-08", "2018-07-09", "2018-07-10", "2018-07-11", "2018-07-12", "2018-07-13", "2018-07-14", "2018-07-15", "2018-07-16", "2018-07-17", "2018-07-18", "2018-07-19", "2018-07-20", "2018-07-21", "2018-07-22", "2018-07-23", "2018-07-24", "2018-07-25", "2018-07-26", "2018-07-27", "2018-07-28", "2018-07-29", "2018-07-30", "2018-07-31"]
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [{"name":"oppo自然量","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[168,396,329,279,282,278,116,78,296,284,461,351,532,247,314,729,660,672,347,515,281,252,565,672,649,421,497,270,227,405,435]},{"name":"vivo","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[4,8,11,6,2,5,6,4,3,5,6,110,162,92,153,242,89,71,37,52,73,52,35,29,17,20,21,20,20,22,32]},{"name":"信息流","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[1,3,3,3,8,6,2,6,9,9,18,14,1,3,7,11,11,154,5,3,6,11,9,2,2,2,1,72,33]},{"name":"其他","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[17,23,35,15,13,14,15,16,8,14,27,234,284,98,141,204,96,68,47,63,60,44,48,46,38,28,21,31,29,21,31]},{"name":"其他推广渠道","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[10,15,27,28,40,89,21,7,79,94,111,73,73,44,77,46,63,69,231,13,2,6,15,22,29,11,54,22,17,124,87]},{"name":"分享链接","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[1,2,1,2,2,2,4,2,69,123,141,387,676,604,261,199,118,118,91,70,70,51,74,70,57,43,41,38,35]},{"name":"应用分发","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[13,34,16,22,29,29,9,6,33,27,65,204,70,38,30,48,41,45,106,19,9,12,22,29,33,14,20,27,18,117,352]},{"name":"应用宝","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[24,37,33,12,19,23,20,30,30,22,60,1053,1502,633,891,1131,528,305,254,273,324,223,179,142,123,104,102,86,67,86,91]},{"name":"搜索推广","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[4,4,1,1,3,1,2,1,2,4,73,54,1,1,1,1,1,22,1,1,13,28]},{"name":"钱包尾量","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[14,14,11,14,30,39,36,52,49,34,59,61,47,40,32,14,19,16,49,6,10,10,5,9,3,4,10,34,40,71,63]}]
                }
            }
        },

        mounted() {
            this.$ajax.get('/home', {
                url: '/home',
                baseURL: process.env.API_BASEURL,
            }).then((res) => {
                this.channelIds = res.data[0].channelId;
            });
            this.getData();

            this.channelchart = this.$echarts.init(document.getElementById('channelFlow'));
            this.channelchart.setOption(this.channelOption,true);

            this.dpdchart = this.$echarts.init(document.getElementById('main'));
            this.dpdchart.setOption(this.dpdOption,true);
        },

        methods: {

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
                this.getData()
            },
            
            //获取每日渠道数据
            getChannel() {
                this.$ajax.get('/channelData', {
                    url: '/channelData',
                    baseURL: process.env.API_BASEURL,
                    params: {
                        dateS: this.decTime.timeSlotA[0],
                        dateF: this.decTime.timeSlotA[1],
                        status:'apply'
                    }
                }).then((res) => {
                    console.log(1212);
                    this.channelOption.series=res.data.data;
                    this.channelOption.xAxis=[
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : res.data.dates
                        }
                    ];
                    this.channelOption.legend.data=res.data.legend;
                    this.channelchart.setOption(this.channelOption,true);
                    this.tableData=res.data.tableData;
                    this.subTitle=Object.keys(res.data.tableData[0]);
                })
            },

            //获取后台数据
            getData() {
                var start = new Date().getTime();
                this.$ajax.get('/chartART', {
                    url: '/chartART',
                    baseURL: process.env.API_BASEURL,
                    params: {
                        date: this.thisDay,
                        weeksNb: this.weeksNb,
                        isNew: this.isNew,
                        channelId: this.channelId
                    }

                }).then((res) => {
                    var dataArr = {};
                    var dateArr = [];
                    for (var i in res.data) {
                        dataArr[i] = [];
                        for (var j in res.data[i]) {
                            if (j != 'all') {
                                dateArr.push(j);
                                dataArr[i].push({[j]: res.data[i][j]});
                            }
                        }
                        dataArr[i].sort(function (a, b) {
                            var c, d;
                            for (var s in a) {
                                c = s;
                            }
                            for (var t in b) {
                                d = t;
                            }
                            return c > t ? 1 : -1;
                        });

                        for (var s = 0; s < dataArr[i].length; s++) {
                            for (var u in dataArr[i][s]) {
                                dataArr[i][s] = dataArr[i][s][u];
                            }
                        }
                    }
                    dateArr = this.uniq(dateArr);
                    for (var i = 0; i < dateArr.length; i++) {
                        dateArr[i] = dateArr[i].split('-')[0] + "/" + dateArr[i].split('-')[1] + "/" + dateArr[i].split('-')[2] + "-" + dateArr[i].split('-')[3]
                            + "/" + dateArr[i].split('-')[4] + "/" + dateArr[i].split('-')[5];
                    }
                    this.xaxis = dateArr;
                    this.dataArr = dataArr;
                    switch (this.backgroundColor3) {
                        case 0:
                            this.ART_Ratio();
                            break;
                        case 1:
                            this.ART_Number(this.seriesNb(0));
                            break;
                        case 2:
                            this.ART_Number(this.seriesNb(1));
                            break;
                        default:
                    }
                    ;
                });
            },

            //去重
            uniq(Array) {
                Array = Array.sort();
                var Ary = JSON.parse(JSON.stringify(Array));
                var newArr = [];
                for (var i = 0; i < Ary.length; i++) {
                    if (newArr.indexOf(Ary[i]) == -1) {
                        newArr.push(Ary[i]);
                    }
                }
                return newArr;
            },

            //x轴坐标(["2018/3/17-2018/3/23",...] 周5-周5的日期区间段)
            xAxis() {
                var arr = this.xaxis;
                return arr;
            },

            //产品名( [易借款 , 易借款_前期收费产品, ...] )
            legend() {
                var arr = [];
                for (var i in this.dataArr) {
                    arr.push(i)
                }
                return arr;
            },

            //批复分布/申请分部 chart图数据
            seriesNb(c) {
                var arr = [];
                var dataArr = [];
                for (var i in this.dataArr) {
                    dataArr[i] = [];
                    for (var j = 0; j < this.dataArr[i].length; j++) {
                        dataArr[i].push(this.dataArr[i][j][c]);
                    }
                    arr.push({
                        name: i,
                        type: 'bar',
                        smooth: false,
                        stack: "堆叠",//折叠显示
                        data: dataArr[i]
                    })
                }
                return arr;
            },

            //批复比率 chart图数据
            seriesRt() {
                var sarr = [];
                var all = 0;

                function rt(data, t) {
                    var newArr = [];
                    for (var j = 0; j < data[t].length; j++) {
                        //取得当前 产品t的批复数/批复总数 的比例;
                        if (data[t][j][1] != 0) {
                            newArr[j] = (data[t][j][0] / data[t][j][1] * 100).toFixed(2);
                        } else {
                            newArr[j] = 0
                        }
                    }

                    return newArr;
                }

                for (var i in this.dataArr) {
                    sarr.push({
                        name: i,
                        type: 'line',
                        smooth: false,
                        data: rt(this.dataArr, i)
                    })
                }
                return sarr;
            },

            //批复分布数量/申请分部数量 chart
            ART_Number(series) {
                let myChart = this.$echarts.init(document.getElementById('myChart'), 'shine');
                myChart.clear();
                myChart.setOption({
                    title: {
                        text: 'dec比例',
                        x: '0px',
                        y: '65px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },

                    grid: {
                        left: "50px",
                        top: '15%',
                        containLabel: true
                    },

                    tooltip: {
                        trigger: 'axis',
                        position: function (p) {   //其中p为当前鼠标的位置
                            return [p[0] - 65, p[1] - 10];
                        },
                        align: 'left',
                        formatter: function (params) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "人";
                            }
                            return relVal;
                        }
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
                        y: 60
                    },

                    legend: {
                        data: this.legend()
                    },

                    calculable: true,

                    xAxis: [{
                        type: 'category',

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
                            formatter: '{value}',
                            textStyle: {
                                align: 'right',
                                baseline: 'middle'
                            }
                        },
                    },

                    series: series
                });
            },

            //产品当前周批复比率(本周此产品申请数 / 本周所有申请数) chart
            ART_Ratio() {
                let myChart = this.$echarts.init(document.getElementById('myChart'), 'shine');
                myChart.clear();
                myChart.setOption({
                    title: {
                        text: 'dec比例',
                        x: '0px',
                        y: '65px',
                        textStyle: {
                            fontSize: 14,
                            color: "#40cc90"
                        }
                    },

                    tooltip: {
                        trigger: 'axis',
                        position: function (p) {   //其中p为当前鼠标的位置
                            return [p[0] - 65, p[1] - 10];
                        },
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

                    grid: {
                        left: "50px",
                        top: '15%',
                        containLabel: true
                    },

                    legend: {
                        data: this.legend()
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
                        y: 60
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
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value}%',
                            textStyle: {
                                align: 'right',
                                baseline: 'middle'
                            }
                        },
                    },

                    series: this.seriesRt()
                });
            },

            //修改channelId
            channelIdCheck() {
                if (this.channelId) {
                    this.getData()
                }
            },

            //产品当前周批复比率
            typeRatio() {
                this.backgroundColor3 = 0;
                this.ART_Ratio()
            },

            //批复分布
            typeReply() {
                this.backgroundColor3 = 1;
                this.ART_Number(this.seriesNb(0))
            },

            //申请分布
            typeApply() {
                this.backgroundColor3 = 2;
                this.ART_Number(this.seriesNb(1))
            },

            //修改日期
            changeDate() {
                this.getData()
            },

            //向前周数
            nbWeeksAgo() {
                this.getData()
            },

            //回车事件
            thisInputBlur(ev) {
                ev.target.blur();
            },
        }
    }
</script>

<style scoped>
    #chart_ART {
        margin: 10px;
        padding: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
    }

    .active1 {
        background: #0078f5 !important;
        border: #3a8ee6 1px solid !important;
    }

    .active2 {
        background: #328609 !important;
        border: #328609 1px solid !important;
    }
</style>
