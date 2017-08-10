<%if(item.length){%>
<%for(var i=0; i<item.length;i++){%>
<a href="javascript:void(0);" data-id="<%=item[i].id%>" class="material-item-link">
<div class="material-item">
		<span>物料ID:<%=item[i].id%></span>   
		<span class='arrow-right'></span>       
</div>
</a>
<%}%>
<%}%>