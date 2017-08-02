<%for (var i = 0; i < formatdata.length; i++) {%>
    <li class="table-view-cell order-detail-item">
        <span class="font-color-gray order-detail-label"><%=formatdata[i].label%></span>
        <span class="order-detail-content"><%=formatdata[i].content%></span>
    </li>
<%}%>