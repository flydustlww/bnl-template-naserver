<%if(item.length){%>
<%for(var i=0; i<item.length;i++){%>
<a href="<%=url%>&id=<%=item[i].id%>">
<div class="material-item">
		<span>物料ID:<%=item[i].id%></span>   
		<span class='arrow-right'></span>       
</div>
</a>
<%}%>
<%}%>