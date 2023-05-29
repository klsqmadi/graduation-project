<template>
  <div class="w-full h-full">
    <div
      id="luckysheet"
      style="
        margin: 0px;
        padding: 0px;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
      "
    ></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'vue-router';
const router = useRouter();
const uuid = uuidv4();
const { gridKey } = router.currentRoute.value.query;
console.log(gridKey);
onMounted(() => {
  $(function () {
    //配置项
    luckysheet.create({
      container: 'luckysheet', // 设定DOM容器的id
      gridKey: gridKey,
      title: '123', // 设定表格名称
      lang: 'zh', // 设定表格语言
      showinfobar: false,
      showtoolbar: true,
      showtoolbarConfig: {
        undoRedo: true, //撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
        paintFormat: false, //格式刷
        currencyFormat: false, //货币格式
        percentageFormat: false, //百分比格式
        numberDecrease: false, // '减少小数位数'
        numberIncrease: false, // '增加小数位数
        moreFormats: false, // '更多格式'
        font: false, // '字体'
        fontSize: false, // '字号大小'
        bold: false, // '粗体 (Ctrl+B)'
        italic: false, // '斜体 (Ctrl+I)'
        strikethrough: false, // '删除线 (Alt+Shift+5)'
        underline: false, // '下划线 (Alt+Shift+6)'
        textColor: false, // '文本颜色'
        fillColor: true, // '单元格颜色'
        border: false, // '边框'
        mergeCell: false, // '合并单元格'
        horizontalAlignMode: false, // '水平对齐方式'
        verticalAlignMode: false, // '垂直对齐方式'
        textWrapMode: false, // '换行方式'
        textRotateMode: false, // '文本旋转方式'
        image: false, // '插入图片'
        link: false, // '插入链接'
        chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
        postil: false, //'批注'
        pivotTable: false, //'数据透视表'
        function: false, // '公式'
        frozenMode: false, // '冻结方式'
        sortAndFilter: false, // '排序和筛选'
        conditionalFormat: false, // '条件格式'
        dataVerification: false, // '数据验证'
        splitColumn: false, // '分列'
        screenshot: false, // '截图'
        findAndReplace: false, // '查找替换'
        protection: false, // '工作表保护'
        print: false, // '打印'
      },

      showstatisticBar: false,
      showsheetbar: true,
      sheetFormulaBar: true,
      loadUrl: `http://localhost:3000/table/load?gridKey=${gridKey}`,
      allowUpdate: true,
      updateUrl: `ws://localhost:3000?uuid=${uuid}&gridKey=${gridKey}`,
      data: [
        {
          name: 'Cell', //工作表名称
          color: '', //工作表颜色
          index: 0, //工作表索引
          status: 1, //激活状态
          order: 0, //工作表的下标
          hide: 0, //是否隐藏
          row: 36, //行数
          column: 18, //列数
          defaultRowHeight: 19, //自定义行高
          defaultColWidth: 73, //自定义列宽
          celldata: [], //初始化使用的单元格数据
          config: {
            merge: {}, //合并单元格
            rowlen: {}, //表格行高
            columnlen: {}, //表格列宽
            rowhidden: {}, //隐藏行
            colhidden: {}, //隐藏列
            borderInfo: {}, //边框
            authority: {}, //工作表保护
          },
          scrollLeft: 0, //左右滚动条位置
          scrollTop: 315, //上下滚动条位置
          luckysheet_select_save: [], //选中的区域
          calcChain: [], //公式链
          isPivotTable: false, //是否数据透视表
          pivotTable: {}, //数据透视表设置
          filter_select: {}, //筛选范围
          filter: null, //筛选配置
          luckysheet_alternateformat_save: [], //交替颜色
          luckysheet_alternateformat_save_modelCustom: [], //自定义交替颜色
          luckysheet_conditionformat_save: {}, //条件格式
          frozen: {}, //冻结行列配置
          chart: [], //图表配置
          zoomRatio: 1, // 缩放比例
          image: [], //图片
          showGridLines: 1, //是否显示网格线
          dataVerification: {}, //数据验证配置
        },
      ],
      cellRightClickConfig: {
        copy: false, // 复制
        copyAs: false, // 复制为
        paste: false, // 粘贴
        insertRow: true, // 插入行
        insertColumn: true, // 插入列
        deleteRow: true, // 删除选中行
        deleteColumn: true, // 删除选中列
        deleteCell: true, // 删除单元格
        hideRow: false, // 隐藏选中行和显示选中行
        hideColumn: false, // 隐藏选中列和显示选中列
        rowHeight: false, // 行高
        columnWidth: false, // 列宽
        clear: false, // 清除内容
        matrix: false, // 矩阵操作选区
        sort: false, // 排序选区
        filter: false, // 筛选选区
        chart: false, // 图表生成
        image: false, // 插入图片
        link: false, // 插入链接
        data: false, // 数据验证
        cellFormat: false, // 设置单元格格式
      },
    });
  });
});
</script>

<style lang="scss" scoped></style>
