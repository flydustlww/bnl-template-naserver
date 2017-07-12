<div>
<div class="select-wrap" id="select-wrap">
    <input type="text" id="input" placeholder="请输入门店名称/门店ID" class="mendian-id-text" v-model="mendianInfo" />
    <div class="clearlayer" @click = clear v-show='mendianInfo'>
    	<span class="clear"><span class="clear-close"></span></span>
    </div>
    
    <span class="search" :class="{pink:isPink}" >搜索</span>
</div>
<div class="content-note" v-show='isShowNote'>
	<span class="symbol">*</span> <span class="text">门店ID请咨询销售或通过糯米商家app查询</span>
</div>
<div class="mendian-lists" id="wrapper" v-show="isShowLists">
	<div class="list" v-for="(item,index) in items "  v-bind:class="{'lastItem': (items.length-1)===index}" @click = bindMaterial(item.alliance_name,item.merchant_id)>
		<div class="mendian-name">{{item.alliance_name}}</div>
		<div class="mendian-id">门店ID:{{item.merchant_id}}</div>
		<div class="mendian-bind" >+立即绑定</div>
	</div>
</div>
<div class="tips" v-show='isShowTps'>没有找到该门店，请先建立该门店联盟</div>
</div>