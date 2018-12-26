
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
                <h3><b>渠道进件变动情况（新用户）</b></h3>

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
            <div id="channelFlow" :style="{width:'100%',height:'600px',margin:'0 0 2em 0'}">
            </div>
            <div id="channelRateFlow" :style="{width:'100%',height:'600px',margin:'0 0 2em 0'}">
            </div>
            <!--newORold-->
            <el-button-group style="margin-left: 2%;white-space: nowrap;">
                <el-button v-for="(item2,index2) in userStatus" type="success"
                    :key="item2"
                    @click="changeStatus(item2,index2)"
                    :class="{active2:backgroundColor2 == index2}"
                    style="padding: 12px 10px">
                    {{item2}}
                </el-button>
            </el-button-group>
            <div id="classFlow" :style="{width:'100%',height:'600px'}">
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

        <el-card class="box-card" style="margin-bottom: 0px">
            <div id="main" :style="{width:'100%',height:'600px',marginBottom:'30px'}"></div>
            <div id="dotmap" :style="{width:'100%',height:'600px'}"></div>
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
                userStatus: ["申请", "批复"],
                postStatus:'apply',
                backgroundColor2: 0,
                xaxis: ["2018/3/17-2018/3/23",
                    "2018/3/24-2018/3/30", "2018/3/31-2018/4/6", "2018/4/7-2018/4/13", "2018/4/14-2018/4/20",
                    "2018/4/21-2018/4/27", "2018/4/28-2018/5/4"],
                dataArr: {},
                backgroundColor3: 0,
                channelId: ["0"],
                channelIds: [],
                decTime: {
                    timeSlotA:[new Date("2018-08-01"), new Date("2018-10-01")],
                    timeSlotB:[new Date("2018-08-01"), new Date("2018-10-01")]
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
                dotdata:[{"name":"7","value":"180"},{"name":"9","value":"0"},{"name":"15","value":"0"},{"name":"29","value":"1"},{"name":"37","value":"180"},{"name":"41","value":"0"},{"name":"51","value":"180"},{"name":"53","value":"0"},{"name":"59","value":"180"},{"name":"62","value":"0"},{"name":"64","value":"180"},{"name":"66","value":"0"},{"name":"73","value":"0"},{"name":"74","value":"0"},{"name":"79","value":"4"},{"name":"80","value":"180"},{"name":"87","value":"4"}],
                geoCoordMap : {'7':[121.437,31.2307],'9':[121.437,31.2308],'15':[121.437,31.2306],'29':[116.757,36.7693],'37':[108.86,34.2367],'41':[108.434,24.559],'51':[116.65,35.4163],'53':[120.011,30.6453],'59':[118.903,25.0091],'62':[99.2574,24.0215],'64':[114.439,22.8264],'66':[121.44,31.0771],'73':[99.2948,27.163],'74':[117.05,24.6183],'79':[113.704,34.991],'80':[111.439,27.6916],'87':[121.035,30.1225]},

                dotmapOption:{
                    title: {
                            text: '逾期地域分布情况',
                            left: 'center',
                            backgroundColor:'rgba(255,255,255,0.84)',
                            zlevel:4,
                            textStyle: {
                                color: '#001200'
                            }
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        bmap: {
                            center: [104.114129, 37.550339],
                            zoom: 5,
                            roam: true,
                            mapStyle: {
                                styleJson: [
                              {
                                        "featureType": "land",
                                        "elementType": "geometry",
                                        "stylers": {
                                                  "color": "#e7f7fc"
                                        }
                              },
                              {
                                        "featureType": "water",
                                        "elementType": "all",
                                        "stylers": {
                                                  "color": "#96b5d6"
                                        }
                              },
                              {
                                        "featureType": "green",
                                        "elementType": "all",
                                        "stylers": {
                                                  "color": "#b0d3dd"
                                        }
                              },
                              {
                                        "featureType": "highway",
                                        "elementType": "geometry.fill",
                                        "stylers": {
                                                  "color": "#a6cfcf"
                                        }
                              },
                              {
                                        "featureType": "highway",
                                        "elementType": "geometry.stroke",
                                        "stylers": {
                                                  "color": "#7dabb3"
                                        }
                              },
                              {
                                        "featureType": "arterial",
                                        "elementType": "geometry.fill",
                                        "stylers": {
                                                  "color": "#e7f7fc"
                                        }
                              },
                              {
                                        "featureType": "arterial",
                                        "elementType": "geometry.stroke",
                                        "stylers": {
                                                  "color": "#b0d5d4"
                                        }
                              },
                              {
                                        "featureType": "local",
                                        "elementType": "labels.text.fill",
                                        "stylers": {
                                                  "color": "#7a959a"
                                        }
                              },
                              {
                                        "featureType": "land",
                                        "elementType": "labels.text.stroke",
                                        "stylers": {
                                                  "color": "#d6e4e5"
                                        }
                              },
                              {
                                        "featureType": "arterial",
                                        "elementType": "labels.text.fill",
                                        "stylers": {
                                                  "color": "#374a46"
                                        }
                              },
                              {
                                        "featureType": "highway",
                                        "elementType": "labels.text.fill",
                                        "stylers": {
                                                  "color": "#374a46"
                                        }
                              },
                              {
                                        "featureType": "highway",
                                        "elementType": "labels.text.stroke",
                                        "stylers": {
                                                  "color": "#e9eeedff"
                                        }
                              }
                        ]
                        }
                    },
                    series : [
                        {
                            name: '逾期天数',
                            type: 'scatter',
                            coordinateSystem: 'bmap',
                            // data: this.convertData(this.dotdata),
                            symbolSize: 5,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#003dff'
                                }
                            }
                        },
                        {
                            name: '逾期天数（大于30）',
                            type: 'effectScatter',
                            coordinateSystem: 'bmap',
                            // data: this.convertData(this.dotdata.filter(x=>parseInt(x.value)>30)),
                            symbolSize: 5,
                            showEffectOn: 'emphasis',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ff0000',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        }
                    ]
                },
                tableData: [],
                subTitle: [],
                channelOption:{
                    title: {
                        text: '申请量变动'
                    },
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
                        data:["oppo自然量", "vivo", "信息流", "其他", "其他推广渠道", "分享链接", "应用分发", "应用宝", "搜索推广", "钱包尾量", "贷款超市推广", "苹果APP STORE"]
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
                            data : ["2018-08-01", "2018-08-02", "2018-08-03", "2018-08-04", "2018-08-05", "2018-08-06", "2018-08-07", "2018-08-08", "2018-08-09", "2018-08-10", "2018-08-11", "2018-08-12", "2018-08-13", "2018-08-14", "2018-08-15", "2018-08-16", "2018-08-17", "2018-08-18", "2018-08-19", "2018-08-20", "2018-08-21", "2018-08-22", "2018-08-23", "2018-08-24", "2018-08-25", "2018-08-26", "2018-08-27", "2018-08-28", "2018-08-29", "2018-08-30", "2018-08-31", "2018-09-01", "2018-09-02", "2018-09-03", "2018-09-04", "2018-09-05", "2018-09-06", "2018-09-07", "2018-09-08", "2018-09-09", "2018-09-10", "2018-09-11", "2018-09-12", "2018-09-13"]
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                        }
                    ],
                    series : [{"name":"oppo自然量","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[244,196,172,113,136,130,192,238,205,204,102,101,180,171,192,186,174,134,118,206,184,186,208,150,121,105,186,203,218,276,183,159,164,168,167,231,236,237,185,167,218,205,241,11]},{"name":"vivo","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[18,23,22,12,19,22,24,23,31,21,11,17,19,26,18,27,13,24,11,54,39,37,42,39,49,29,39,47,32,40,43,39,22,41,41,31,44,37,33,42,28,42,38,0]},{"name":"信息流","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[22,27,6,11,16,10,9,27,14,19,2,7,11,1,13,40,39,5,3,47,47,43,65,58,13,7,33,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"其他","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[24,16,26,16,13,22,22,26,18,26,11,14,17,23,25,16,39,51,18,160,114,54,81,116,106,54,94,86,94,123,128,100,53,114,125,129,150,141,156,98,113,115,98,3]},{"name":"其他推广渠道","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[176,85,42,27,30,25,51,44,43,54,26,26,33,20,26,34,40,21,13,39,34,37,40,27,17,13,18,5,13,20,33,10,12,19,13,21,15,12,12,10,16,14,7,0]},{"name":"分享链接","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[38,32,44,26,32,35,42,32,35,43,35,27,86,84,114,106,132,89,41,128,97,70,127,160,188,106,162,173,138,122,149,124,100,174,196,169,153,132,163,61,164,140,128,1]},{"name":"应用分发","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[275,641,94,51,59,315,585,517,597,651,99,54,680,337,452,548,602,98,53,529,586,599,690,241,112,61,202,109,164,518,288,71,28,237,160,234,203,256,60,31,232,222,162,3]},{"name":"应用宝","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[78,83,78,72,67,85,88,87,49,70,59,61,79,106,78,112,139,115,118,276,198,157,163,159,139,127,167,175,166,139,156,133,76,162,115,145,155,201,180,137,164,111,112,3]},{"name":"搜索推广","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[17,2,1,1,2,1,1,5,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"钱包尾量","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[90,78,56,103,102,110,102,112,112,107,103,107,98,91,88,81,75,77,52,71,73,66,66,76,50,65,61,46,55,18,62,57,55,64,67,53,83,63,69,82,76,60,72,2]},{"name":"贷款超市推广","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[0,0,0,0,0,0,0,0,69,140,119,78,84,137,132,201,232,382,453,437,214,90,53,57,8,6,20,15,15,17,10,12,9,13,18,217,191,549,559,765,566,362,255,5]},{"name":"苹果APP STORE","type":"line","stack":"总量","areaStyle":{"normal":{}},"data":[0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,4,1,5,8,0,2,3,2,0,7,6,7,2,7,3,4,10,17,16,20,15,19,6,13,13,5,0]}]
                },
                channelRateOption:{
                    title: {
                        text: '批复率变动'
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
                        data:["oppo自然量", "vivo", "信息流", "其他", "其他推广渠道", "分享链接", "应用分发", "应用宝", "搜索推广", "钱包尾量", "贷款超市推广", "苹果APP STORE"],
                        selected:{"oppo自然量":1, "vivo":0, "信息流":0, "其他":0, "其他推广渠道":0, "分享链接":0, "应用分发":1, "应用宝":0, "搜索推广":0, "钱包尾量":0, "贷款超市推广":1, "苹果APP STORE":0}
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
                        data: ["2018-08-01", "2018-08-02", "2018-08-03", "2018-08-04", "2018-08-05", "2018-08-06", "2018-08-07", "2018-08-08", "2018-08-09", "2018-08-10", "2018-08-11", "2018-08-12", "2018-08-13", "2018-08-14", "2018-08-15", "2018-08-16", "2018-08-17", "2018-08-18", "2018-08-19", "2018-08-20", "2018-08-21", "2018-08-22", "2018-08-23", "2018-08-24", "2018-08-25", "2018-08-26", "2018-08-27", "2018-08-28", "2018-08-29", "2018-08-30", "2018-08-31", "2018-09-01", "2018-09-02", "2018-09-03", "2018-09-04", "2018-09-05", "2018-09-06", "2018-09-07", "2018-09-08", "2018-09-09", "2018-09-10", "2018-09-11", "2018-09-12", "2018-09-13"]
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel :{
                            formatter:x=>Math.round(x*10000)/100+'%'
                        }
                        
                    },
                    series: [{"name":"oppo自然量","type":"line","data":[0.1025,0.1122,0.1628,0.0973,0.1103,0.1077,0.1042,0.1261,0.0829,0.0833,0.098,0.0891,0.1111,0.0702,0.0885,0.0806,0.0862,0.0672,0.0508,0.0485,0.0543,0.0753,0.0529,0.0867,0.0992,0.0571,0.0753,0.0542,0.1009,0.0725,0.0874,0.0755,0.0732,0.0476,0.0299,0.0649,0.0551,0.0506,0.0162,0.0359,0.0642,0.0537,0.029,0.0242]},{"name":"vivo","type":"line","data":[0,0.1304,0.0909,0.0833,0.0526,0,0.0417,0.0435,0.129,0.0952,0.1818,0.1176,0,0.1538,0.1111,0.1111,0.1538,0.125,0.0909,0.0185,0.0769,0.0811,0.0476,0.0256,0.102,0.1034,0.0769,0.1064,0.1563,0.1,0.1163,0.1026,0.1364,0.0488,0.0732,0.0968,0.0227,0.1081,0.0303,0.0238,0,0.0238,0.0526,0]},{"name":"信息流","type":"line","data":[0,0.0741,0.1667,0.0909,0.125,0.1,0,0.1111,0.1429,0.2632,0,0,0.0909,0,0,0.1,0.0513,0.2,0,0.0851,0.0851,0.0465,0,0.0345,0,0,0.1212,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"其他","type":"line","data":[0.0833,0.125,0.0385,0.0625,0.0769,0.0909,0.0909,0.0769,0,0.0385,0,0.0714,0.0588,0.087,0.08,0,0.0513,0.0392,0,0.0563,0.0439,0.037,0.1481,0.0603,0.0283,0.0556,0.0957,0.0465,0.1277,0.0813,0.0547,0.05,0.0377,0.0789,0.056,0.1163,0.0667,0.0638,0.0385,0.0408,0.0088,0.0348,0.0204,0.0189]},{"name":"其他推广渠道","type":"line","data":[0.1193,0.2118,0.2381,0.2222,0.1667,0.2,0.1961,0.2045,0.186,0.2778,0.2692,0.1538,0.2727,0.3,0.3462,0.1176,0.25,0.2381,0.3846,0.2308,0.0882,0.2973,0.225,0.2963,0.2353,0.3846,0.2222,0.4,0.2308,0.25,0.0909,0.3,0.0833,0.2105,0.0769,0.1905,0.1333,0.1667,0.0833,0.1,0.0625,0.2143,0.1429,0]},{"name":"分享链接","type":"line","data":[0,0.0313,0.0682,0.0769,0.0313,0.0571,0.119,0.0313,0.0571,0.093,0.0286,0,0.0698,0.0476,0.0526,0.066,0.0682,0.0674,0,0.0469,0.1237,0.0714,0.0551,0.0875,0.0798,0.0283,0.0556,0.0578,0.058,0.0574,0.0336,0.0645,0.02,0.0517,0.0306,0.0296,0.0719,0.0682,0.0123,0.0656,0.0183,0.05,0.0469,0.0318]},{"name":"应用分发","type":"line","data":[0.0764,0.0998,0.1277,0.0784,0.0169,0.0825,0.0786,0.0948,0.0838,0.0906,0.0808,0.0556,0.0706,0.0742,0.0686,0.0803,0.0664,0.0612,0.0377,0.0775,0.0717,0.0868,0.0899,0.083,0.0804,0.0656,0.0446,0.0367,0.0549,0.0695,0.059,0.0282,0,0.0549,0.025,0.0256,0.0443,0.0352,0.05,0.0968,0.0129,0.018,0.0185,0]},{"name":"应用宝","type":"line","data":[0.0641,0.0843,0.0769,0.0556,0.0299,0.0588,0.1136,0.1494,0.1633,0.1,0.0847,0.0164,0.1392,0.1038,0.0256,0.1339,0.0647,0.0696,0.0678,0.0833,0.0505,0.0701,0.1227,0.0503,0.0719,0.0394,0.1198,0.0457,0.0783,0.0576,0.0962,0.0376,0.0526,0.0494,0.0435,0.0483,0.0581,0.0299,0.0611,0.0073,0.0366,0.036,0.0268,0.0694]},{"name":"搜索推广","type":"line","data":[0.0588,0,0,0,0,0,0,0,0,0,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"钱包尾量","type":"line","data":[0.1556,0.0897,0.0893,0.0971,0.1275,0.1273,0.1176,0.125,0.125,0.1028,0.0971,0.0748,0.0918,0.1319,0.1136,0.0988,0.0667,0.039,0.0962,0.0563,0.1507,0.1061,0.0606,0.0658,0.18,0.1077,0.0164,0.0652,0.0364,0.0556,0.1129,0.0526,0.0545,0.0469,0.0746,0.0566,0,0.0476,0.058,0.0122,0,0.0167,0.0139,0]},{"name":"贷款超市推广","type":"line","data":[0,0,0,0,0,0,0,0,0.058,0.0714,0.0504,0.0641,0.131,0.0949,0.1288,0.0597,0.0776,0.089,0.0839,0.0755,0.0607,0.0889,0.1132,0.0877,0.125,0.1667,0.05,0.1333,0.0667,0.0588,0.2,0,0,0.0769,0.1111,0.0691,0.0942,0.0874,0.0447,0.0654,0.0707,0.0525,0.0353,0.0455]},{"name":"苹果APP STORE","type":"line","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.25,0,0.2,0.125,0,0,0,0,0,0,0.3333,0.2857,0,0.4286,0,0,0.2,0.2353,0.1875,0.05,0,0.1053,0,0.0769,0.1538,0,0.0833]}]
                },
                classOption:{
                    title: {
                        text: '用户等级变动'
                    },
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
                        data:[0,1,2]
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
                            data : []
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                        }
                    ],
                    series : []

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

            this.channelRateChart = this.$echarts.init(document.getElementById('channelRateFlow'));
            this.channelRateChart.setOption(this.channelRateOption,true);

            this.classChart = this.$echarts.init(document.getElementById('classFlow'));
            this.classChart.setOption(this.classOption,true);


            this.dpdchart = this.$echarts.init(document.getElementById('main'));
            this.dpdchart.setOption(this.dpdOption,true);

            this.dotmapchart = this.$echarts.init(document.getElementById('dotmap'));
            this.$BaiduMap.init().then((BMap) => {
                this.getDotmap();
            })
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

            changeStatus(boolString, index) {
                this.backgroundColor2 = index;
                switch (boolString) {
                    case "申请" :
                        this.postStatus = 'apply';
                        break;
                    case "批复" :
                        this.postStatus = "approve";
                        break;
                    default:
                        ;
                }
                this.getChannel()
            },
            
            //转换数据——获取逾期位置
            getDotmap() {
                this.$ajax.get('/dotData', {
                    url: '/dotData',
                    baseURL: process.env.API_BASEURL
                }).then((res) => {
                    this.dotdata=res.data.dotdata;
                    this.geoCoordMap=res.data.geoCoordMap;
                    // console.log(this.dotdata);
                    this.dotmapOption.series[0].data=this.convertData(this.dotdata);
                    this.dotmapOption.series[1].data=this.convertData(this.dotdata.filter(x=>parseInt(x.value)>30));
                    this.dotmapchart.setOption(this.dotmapOption,true);
                });
            },

            //获取每日渠道数据
            getChannel() {
                this.$ajax.get('/channelData', {
                    url: '/channelData',
                    baseURL: process.env.API_BASEURL,
                    params: {
                        dateS: this.decTime.timeSlotA[0],
                        dateF: this.decTime.timeSlotA[1],
                        status: this.postStatus
                    }
                }).then((res) => {
                    this.channelOption.series=res.data.data;
                    this.channelRateOption.series=res.data.dataRate;
                    this.channelOption.xAxis=[
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : res.data.dates
                        }
                    ];
                    this.channelRateOption.xAxis=[
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : res.data.dates
                        }
                    ];
                    this.channelOption.legend.data=res.data.legend;
                    this.channelRateOption.legend.data=res.data.legend;
                    this.channelchart.setOption(this.channelOption,true);
                    this.channelRateChart.setOption(this.channelRateOption,true);
                    this.tableData=res.data.tableData;
                    this.subTitle=Object.keys(res.data.tableData[0]);
                    this.$ajax.get('/classData', {
                    url: '/classData',
                    baseURL: process.env.API_BASEURL,
                    }).then((resB) => {
                        this.classOption.series=resB.data.data;
                        this.classOption.xAxis=[
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : resB.data.dates
                            }
                        ];
                        this.classOption.legend.data=resB.data.legend;
                        this.classChart.setOption(this.classOption,true);
                    });
                });
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

                    color:['#CCB800','#7ACC00','#14CC00','#00CC52','#00CCB8','#007ACC','#0014CC','#5200CC','#B800CC','#CC007A','#CC0014','#FF6C0A','#FF9147','#0A9DFF','#47B6FF'],

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

                    color:['#CCB800','#7ACC00','#14CC00','#00CC52','#00CCB8','#007ACC','#0014CC','#5200CC','#B800CC','#CC007A','#CC0014','#FF6C0A','#FF9147','#0A9DFF','#47B6FF'],


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
            
            //转换百度位置——dotmap
            convertData (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = this.geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            }
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
