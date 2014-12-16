// Autor: leosansan
// Fecha: 10/12/2014 17:23
// Enlace: http://www.forosdelweb.com/f96/petando-pila-problemas-retos-usando-recursividad-1113701/index4.html#post4661962

#include <stdio.h>
#include <math.h>
 
int DigitosNumero ( int digitosNumero [ 10 ], int numero , int flag ) {
  if ( numero > 0 && flag == 0 )
     digitosNumero [ numero % 10 ]++ , DigitosNumero ( digitosNumero , numero / 10 , 0 ) ;
  else if ( numero > 0 && flag == 1 )
    digitosNumero [ numero % 10 ]-- ,  DigitosNumero ( digitosNumero , numero / 10 , 1 ) ;
  return 1 ;
}
 
int ComprobarDigitos ( int digitosNumero [ 10 ] , int indice , int cont ) {
  if ( indice < 10 )
    return ( digitosNumero [ indice ] == 0 ) ? 1 + ComprobarDigitos ( digitosNumero , indice + 1 , cont + 1 ) : ComprobarDigitos ( digitosNumero , indice + 1 , cont  ) ;
  return 0 ;
}
 
int probar ( int numero , int num_1 , int nMin , int nMax , int flag ) {
  int i , num_2 = 0 , digitosNumero [ 10 ] = {0};
  if ( num_2 < nMax - 1 && num_1 == nMax )
    num_1 = nMin , num_2 = numero / nMax  ;
  if ( num_1 < nMax ){
    num_2 = numero / num_1  ;
    if ( num_1 * num_2 == numero  && num_1 > num_2 ) {
    DigitosNumero(digitosNumero, numero , 0), DigitosNumero(digitosNumero , num_1 , 1), DigitosNumero(digitosNumero , num_2 , 1) ;
    if ( ComprobarDigitos ( digitosNumero , 0 , 0 ) == 10 && ( num_1 % 10 != 0 ||  num_2 % 10 != 0 ) )
      /*printf ( "\n\n\tSI ES VAMPIRO ==> %d = %d * %d\n\n" , numero , num_2 , num_1 ) ,*/ flag ++ ;
  }
  return ( num_1 < nMax - 1 ) ? probar ( numero , 1 + num_1 , nMin , nMax , flag ): ( flag == 0 ) ? /*printf ( "\n\n\t%d NO ES VAMPIRO\n\n"  , numero  ) ,*/ 0 : 1 ;
 }
}
 
int esVampiro( int numero ) {
  int  ndigits = log10 ( numero ) , nMin = pow ( 10 , ndigits / 2 ) , nMax = 10 * nMin  ;
  return ( --ndigits %2 != 0 ) ? /*puts ( "\n\n\tNO ES VAMPIRO por numero impar de cifras.\n\n" ) ,*/ 0 : probar ( numero , nMin , nMin , nMax , 0 ) ;
}
