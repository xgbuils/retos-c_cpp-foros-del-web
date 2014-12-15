// Autor: eferion
// Fecha: 04-12-2014 15:46

#include <stdbool.h>

#define SWAP(a,b) { int c = *a; *a = *b; *b = c; }
 
const int _factor[] = { 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000 };
 
typedef struct _data
{
  int length;
  int digits[15];
  int* endPtr;
} Data;
 
void toArray( int number, Data* data )
{
  if ( number > 0 )
  {
    *data->endPtr = number % 10;
    ++data->endPtr;
    ++data->length;
    toArray( number/10, data );
  }
}
 
int factorial( int n )
{
  if ( n == 2 )
    return 2;
  else
    return n * factorial( n - 1 );
}
 
int toInt( int* first, int* last, const int* factor )
{
  if ( first != last )
  {
    if ( *first )
      return *first * *factor + toInt( first + 1, last, factor + 1 );
    else
      return toInt( ++first, last, factor + 1 );
  }
  else
    return 0;
}
 
void reverse( int* first, int* last )
{
  if ( first <= --last )
  {
    SWAP( first, last );
    reverse( ++first, last );
  }
}
 
int* findLessThan( int* cursor, int* toCompare )
{
  if ( *--cursor > *toCompare )
    return cursor;
 
  return findLessThan( cursor, toCompare );
}
 
void permutation( int* first, int* last, int* cursor )
{
  int* lastCursor = cursor--;
 
  if ( *cursor < *lastCursor )
  {
    int* ptr = findLessThan( last, cursor );
    SWAP( cursor, ptr );
    reverse( lastCursor, last );
  }
  else if ( cursor != first )
    permutation( first, last, cursor );
  else
    reverse( first, last );
}
 
bool es_vampiro( int num, Data* data, int maxPermutaciones )
{
  int* mid = &data->digits[ data->length / 2 ];
  int int1 = toInt( data->digits, mid, _factor );
  int int2 = toInt( mid, data->endPtr, _factor );
 
  if ( ( *data->digits || *mid ) && int1 * int2 == num )
    return true;
 
  if ( --maxPermutaciones )
  {
    permutation( data->digits, data->endPtr, data->endPtr - 1 );
    return es_vampiro( num, data, maxPermutaciones );
  }
 
  return false;
}
 
int esVampiro( int num )
{
  Data data;
  data.length = 0;
  data.endPtr = data.digits;
  toArray( num, &data );
 
  if ( data.length % 2 )
    return 0;
 
  return es_vampiro( num, &data, factorial( data.length ) )? 1 : 0;
}