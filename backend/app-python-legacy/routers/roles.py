from fastapi import APIRouter, Depends

from app.auth.security import get_current_user
from app.models import User

router = APIRouter()

BUILTIN_ROLES = [
    {"id": "Admin", "permissions": ["*"]},
    {"id": "Manager", "permissions": ["deals.*", "leads.*", "contacts.*", "reports.read"]},
    {"id": "Sales", "permissions": ["deals.own", "leads.own", "contacts.own"]},
    {"id": "HR", "permissions": ["users.read", "hr.*"]},
    {"id": "Marketing", "permissions": ["campaigns.*", "leads.read"]},
    {"id": "Finance", "permissions": ["invoices.*", "reports.finance"]},
    {"id": "Customer Support", "permissions": ["tickets.*", "contacts.read"]},
]


@router.get("")
def list_roles(_: User = Depends(get_current_user)):
    return {
        "builtin": BUILTIN_ROLES,
        "custom_roles": [],
        "field_level_permissions": {"status": "stub"},
        "module_permissions": {"status": "stub"},
        "territory_access": {"status": "stub"},
    }
