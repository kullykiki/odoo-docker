import json
import logging

from odoo import fields, http, tools, _
from odoo.http import request, Response
from datetime import datetime

import logging

_logger = logging.getLogger(__name__)

class ApproverLSR(http.Controller):
    # @http.route('/approver', type='http', auth="user", website=True, sitemap=True)
    # def index(self, **kw):
    #     return http.request.render('lsr.approver_calendar')

    @http.route('/api/approver_result/approve', type='json', auth="public", methods=['POST'])
    def get_approve_result(self, **kw):
        data = json.loads(request.httprequest.data)
        # data = json.load()
        # booking_rec = request.env['lsr.booking'].search([('id','=',data["id"])])
        booking_rec = request.env['lsr.booking'].browse(int(data["id"])).write({'result': data["result"],'approver':request.env.user.employee_ids[0],'approved_time':datetime.now(),'status':'done'})
            # booking_rec.write({"result":data["result"]})
        
        # print("success post")
        # record_id = record_id
        # try :
        #     id = kw.get('id')
        #     result = kw.get('result')
        #     approver = kw.get('approver')
        # except Exception as e:
        #     strStatus = {'error': f'An error occurred: {str(e)}'}
        
        # headers = {'Content-Type': 'application/json'}
        # body = { 'results': 'POST SUCCESS' }
        # def date_handler(obj):
        #     return obj.isoformat() if hasattr(obj, 'isoformat') else obj
        return {'result': booking_rec,'current_user':request.env.user}
        # return json.dumps(strStatus)
    
    @http.route('/api/pending/booking_get', type='http', auth='user', methods=['GET'])
    def get_pending_booking(self):
        pending_list = []
        booking_list = request.env['lsr.booking'].search([('status','=','pending')])

        for booking in booking_list:
            pending_list.append({
                'id': booking.id,
                'name': booking.name,
                'booker': booking.booker.name,
                'start_date': booking.start_date,
                'end_date': booking.end_date,
                'title' : booking.title,
                'purpose' : booking.purpose,
                'room' : booking.room.name,
                'floor' : booking.room.floor,
                'room_type' : booking.room.type.name
            })
        headers = {'Content-Type': 'application/json'}
        body = { 'results': { 'code':200, 'message':'OK' ,'data' : pending_list} }
        def date_handler(obj):
            return obj.isoformat() if hasattr(obj, 'isoformat') else obj
        return Response(json.dumps(body, default=date_handler), headers=headers)