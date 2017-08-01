<div class="content-title">
    累计佣金金额
    <span class="total-amount item-status-pink"><%=total_commission%></span>
</div>

<ul class="table-view" id="bill-list">
	<%for(var i=0; i<item.length;i++){%>
	<li class="table-view-cell">    
	        <a class="navigate-right" data-xid="<%=item[i].xid%>" data-commission="<%=item[i].commission%>" data-time=<%=item[i].date%> data-billid= <%=item[i].bill_id%> data-status="<%=item[i].status%>" data-statusstr="<%=item[i].status_str%>" data-billcycle="<%=item[i].bill_cycle%>" >
	        <span class="item-time"><%=item[i].date%></span>
	        <span class="item-amount item-status-pink">￥<%=item[i].formatmoney%></span>
	        <span class="item-status <%=item[i].classname%>"><%=item[i].status_str%></span>
	    </a>
	</li>
	<%}%>
</ul>
