import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // نجلب التوكن أو الكوكيز اللي بتثبت إن المستخدم مسجل دخول
  // ملاحظة: Firebase Auth بيعتمد على Client SDK، لذا سنستخدم كوكيز بسيطة أو نعتمد على التحقق الداخلي
  const session = request.cookies.get('admin_session'); // مثال باستخدام الكوكيز

  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin';

  // إذا حاول يدخل أي صفحة داخل admin وهو مش مسجل دخول
  if (isAdminPage && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// تحديد المسارات التي يراقبها الـ Middleware
export const config = {
  matcher: ['/admin/:path*'],
};