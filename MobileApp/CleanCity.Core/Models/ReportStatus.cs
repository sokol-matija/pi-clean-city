namespace CleanCity.Core.Models;

using CleanCity.Core.Helpers;

// #2: PRIMJENA OTVORENOG/ZATVORENOG NAČELA (OPEN/CLOSED PRINCIPLE)
/* kod je dorađen da koristi atribute za pohranu metapodataka o statusima */
public enum ReportStatus
{
    [StatusMetadata("zaprimljeno", "#FFE0B2", "#E65100")]
    Zaprimljeno,

    [StatusMetadata("u postupku", "#BBDEFB", "#0D47A1")]
    UPostupku,

    [StatusMetadata("riješeno", "#C8E6C9", "#1B5E20")]
    Rijeseno
}


//// STARI KOD
//public enum ReportStatus
//{
//    Zaprimljeno,  // narančasto
//    UPostupku,    // plavo
//    Rijeseno      // zeleno
//}
