
    <ul class="table-view table-view-tpl" id="reward-title-html">
        <li class="table-view-cell">
            <span class="font-color-gray"><%=curday%></span>
            <span class="font-color-gray item-label">总计</span>
            <span class="item-amount item-status-pink item-totalamount"><%=totalamount%></span>
        </li>              
    </ul>
    <ul class="table-view" id="reward-content-list">
        <%for(var i=0; i<detail.length;i++){%>
            <li class="table-view-cell" id=<%=detail[i].id %> >
                <% if (detail[i].finance_type === '1')  {%>
                    推广佣金
                <%}else if (detail[i].finance_type === '2') {%>
                    下级提成
                <%}else {%>
                    作弊扣减
                <%}%>

                <span class="icon icon-down" status="down" id=<%=detail[i].id%> ></span>
                <%if (detail[i].commission >=0) {%>
                    <span class="item-amount item-status-pink">+<%=detail[i].formatcommission %></span> 
                <%}else {%>
                    <span class="item-amount item-status-green"><%=detail[i].formatcommission%></span>
                <%}%>
                <ul class="table-view order-detail-list"></ul>
            </li>
        <%}%>
    </ul>




