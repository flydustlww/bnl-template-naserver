<div> 
    <div class="user-wrap">
        <ul class="user-list">
            <li class="user-item border-bt">百度账号<span>{{passport_username}}</span></li>
            <li class="user-item border-bt" v-if="is_verified">姓名
                <span>{{real_name}}</span>
                <span class="user-verified">已认证</span>
                <strong class="user-ok"></strong>
            </li>
            <li class="user-item border-bt" v-else>姓名
                <span>{{real_name}}</span>
                <span class="user-verified">未认证，去认证</span>
                <strong class="user-error"></strong>
            </li>
            <li class="user-item border-bt">手机号<span>{{mobile}}</span></li>
            <li class="user-item border-bt">证件号<span>{{certificate_no}}</span></li>
            <li class="user-item border-bt">推广区域<span>{{city_name}}</span></li>
            <li class="user-item border-bt">推广联盟<span>{{alliance_name}}</span></li>
        </ul>
    </div>
    <button type="button" class="user-login" v-on:tap="loginClick">退出登录</button>
</div>