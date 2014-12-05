// Autor: HackmanC
// Fecha: 03-12-2014 09:29

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
 
int count(const int value, const int i) {
    return value ? count(value / 10, i + 1) : i;
}
 
void split(const int value, int *dst) {
    if (value > 0) {
        *dst = value % 10;
        split(value / 10, dst - 1);
    }
}
 
int join(int value, const int src[], const int end, const int begin, const int dec) {
    if (end - 3 >= begin) {
        value += (src[end - 3] * dec * 1000) + (src[end - 2] * dec * 100) + (src[end - 1] * dec * 10) + (src[end] * dec);
        return join(value, src, end - 4, begin, dec * 10000);
    } else {
        if (end - 2 >= begin) {
            value += (src[end - 2] * dec * 100) + (src[end - 1] * dec * 10) + (src[end] * dec);
            return join(value, src, end - 3, begin, dec * 1000);
        } else {
            if (end - 1 >= begin) {
                value += (src[end - 1] * dec * 10) + (src[end] * dec);
                return join(value, src, end - 2, begin, dec * 100);
            } else {
                if (end >= begin) {
                    value += src[end] * dec;
                    return join(value, src, end - 1, begin, dec * 10);
                }
            }
        }
    }
    return value;
}
 
void swap(int dst[], const int a, const int b) {
    int t = dst[b]; dst[b] = dst[a]; dst[a] = t;
}
 
int esvampiro3(const int value, int src[], const int digits) {
    int value1 = join(0, src, (digits / 2) - 1, 0, 1);
    int value2 = join(0, src, digits - 1, (digits / 2), 1);
 
    /* printf("%.4d x %.4d\n", value1, value2); */
 
    if (value1 * value2 == value && !(value1 % 10 == 0 && value2 % 10 == 0)) {
        return 1;
    }
 
    return 0;
}
 
int esvampiro2(const int value, int src[], int c[], const int *digits, int i) {
    if(i < *digits) {
        if (c[i] < i) {
            swap(src, i, i % 2 ? c[i] : 0);
            if (esvampiro3(value, src, *digits)) {
                return 1;
            }
            c[i]++;
            i = 1;
        } else {
            c[i++] = 0;
        }
        return esvampiro2(value, src, c, digits, i);
    }
    return 0;
}
 
int esvampiro(const int value, int src[], int c[], const int *digits, int i) {
    if (esvampiro3(value, src, *digits)) {
        return 1;
    }
    return esvampiro2(value, src, c, digits, i);
}
 
int esVampiro(int num) {
    int digits = count(num, 0);
    int memspc = digits * sizeof(int);
 
    int *n = malloc(memspc);
    int *c = malloc(memspc);
 
    split(num, n + (digits - 1));
    memset(c, 0, memspc);
 
    if (digits % 2 == 0) {
        return esvampiro(num, n, c, &digits, 1);
    }
 
    free(c);
    free(n);
 
    return 0;
}
